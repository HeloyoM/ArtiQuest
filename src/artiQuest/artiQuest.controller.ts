import { Controller, Request, Get, Post, Delete, Put, Body, Param, Patch, UseGuards, Inject, UseInterceptors, UploadedFile, Query } from '@nestjs/common'
import { ArtiQuestService } from './artiQuest.service'
import { Article } from '../interface/Article.interface'
import { EditPayloadDto } from './dto/editPayload.dto'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { FileInterceptor } from '@nestjs/platform-express'
import { PDFExtract } from 'pdf.js-extract'
import { randomUUID } from 'crypto'
import { Roles } from 'src/auth/rbac/roles.decorator'
import { RolesGuard } from 'src/auth/rbac/roles.guard'
import CacheKeys from 'src/utils/CacheKeys'
import AppCache from 'src/cache/AppCache'
import IInprogress from 'src/cache/dto/IInprogressArt.dto'
import { Category } from 'src/interface/category.interface'

const CAT = '/cat'
const IN_PROGRESS = '/in-progress'

/*
Multer may not compatible with
third party cloud providers
like Google Firebase */

@Controller('art')
export class ArtiQuestController {
    pdfExtract = new PDFExtract()
    constructor(
        private readonly appCache: AppCache,
        private artService: ArtiQuestService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @Get()
    async getAllArticles() {
        return await this.artService.getAllArticles()
    }

    @Get('/findOne/:id')
    async getArticleById(@Param('id') id: string) {
        const key = `article_${id}`

        let articleContent = await this.cacheManager.get(key)

        if (articleContent == null) {
            articleContent = await this.artService.getArticleById(id)

            await this.cacheManager.set(key, articleContent, 3_600_000 /* hour */)
        }
        return articleContent
    }

    @UseGuards(RolesGuard)
    @Get(IN_PROGRESS)
    @Roles([100])
    async getInprogressArts() {
        return await this.appCache.getInprogressList
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${IN_PROGRESS}/findByAuthor`)
    async getInprogressArtsByAuthorId(@Request() req) {
        const author_id = req.user.userId

        return this.appCache.getInprogressArtsByAuthorId(author_id)
    }

    @UseGuards(JwtAuthGuard)
    @Post(IN_PROGRESS)
    @UseInterceptors(FileInterceptor('file'))
    async initalArticleBeforeUpload(
        @Request() req,
        @Body() art: { art: string },
        @UploadedFile() file: Express.Multer.File,
    ) {
        const author_id = req.user.userId
        const data = this.pdfExtract.extractBuffer(file.buffer)

        const content = (await data).pages.reduce((acc, page) => {
            const contentStrings = page.content.map(item => item.str.trim()).filter(str => str !== '');

            return acc.concat(contentStrings)
        }, []).join(' ')

        const parsedArticle = JSON.parse(art.art)

        const [assignedCategory] = this.artService.assignCategories([parsedArticle])
        assignedCategory.author = author_id

        const [resultArt] = await this.artService.assignAuthors([assignedCategory])

        resultArt.id = randomUUID()
        resultArt.created = new Date().toLocaleDateString()
        resultArt.active = false
        resultArt.viewers = []
        resultArt.rank = { total: 0, voters: [] }
        resultArt.body = content

        await this.cacheManager.set(`${CacheKeys.IN_PROGRESS}-${author_id}-${resultArt.id}`, resultArt, 3_600_000 /* hour */)

        return resultArt
    }

    @UseGuards(JwtAuthGuard)
    @Get('interest')
    async getUserCategoryInterest(@Request() req) {
        return this.artService.getUserCategoryInterest(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArt(@Body() art: Article) {
        try {
            const storedInprogressArticles = await this.appCache.getInprogressList
            const uploadedArticle = storedInprogressArticles.find((a: IInprogress) => a.id === art.id)

            let newArt: Article = { ...uploadedArticle }

            if (typeof uploadedArticle.author !== 'string') {
                newArt.author = uploadedArticle.author.id;
            } else {
                console.warn("Author is not an object, cannot access id.");
            }

            if (typeof uploadedArticle.cat !== 'string') {
                newArt.cat = uploadedArticle.cat.id;
            } else {
                console.warn("Category is not an object, cannot access id.");
            }

            newArt.sub_title = art.sub_title ? art.sub_title : uploadedArticle.sub_title
            newArt.body = art.body ? art.body : uploadedArticle.body
            newArt.title = art.title ? art.title : uploadedArticle.title

            try {
                await this.artService.createArt(newArt)

                await this.appCache.removeFromCache(newArt.author.toString(), newArt.id)
                return uploadedArticle
            } catch (error) {
                throw Error('Unable to insert new article, please get support from site administrator')
            }

        } catch (error) {

        }
    }

    @Put(':id')
    async put(
        @Param('id') id: string,
        @Body() art: Article
    ) {
        return await this.artService.updateArt(id, art)
    }

    @Patch(':id')
    async editArticle(@Param('id') id: string, @Body() payload: EditPayloadDto) {
        return await this.artService.editArticle(id, payload)
    }

    @UseGuards(RolesGuard)
    @Patch('active/:id')
    @Roles([100])
    async activeArticle(@Param('id') id: string) {
        // const key = `ARTICLES_HAVE_BEEN_UPDATED`
        // await this.cacheManager.set(key, true, 24 * 3600 /* hour */)

        return await this.artService.toggleArticleActivity(id)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('rate/:id')
    async rateArticle(
        @Param('id') id: string,
        @Body() payload,
        @Request() req) {
        return await this.artService.rate(id, payload.rate, req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('view/:id')
    async increasArticleViewers(
        @Param('id') id: string,
        @Request() req
    ) {
        return await this.artService.incArtViewers(id, req.user)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.artService.remove(id)
    }

    //category
    @Get('/findBy/:cat')
    async getArticlesByCategoryId(@Param('cat') id: string) {
        const key = `category_${id}`

        let categoryContent = await this.cacheManager.get(key)

        const articlesUpdatedKey = `ARTICLES_HAVE_BEEN_UPDATED`
        const isUpdated = await this.cacheManager.get(articlesUpdatedKey)

        if (categoryContent == null || isUpdated) {
            categoryContent = await this.artService.getArticlesByCategoryId(id)

            await this.cacheManager.set(key, categoryContent, 3_600_000 /* hour */)
        }

        return categoryContent
    }

    @Get(CAT)
    getAllCategories() {
        return this.artService.getAllCategories()
    }

    @Get(`${CAT}/findOne/:id`)
    getCategoryById(@Param('id') id: string) {
        return this.artService.getCategoryById(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post(CAT)
    async createCategory(@Body() cat: Category) {
        return await this.artService.createCategory(cat)
    }
}