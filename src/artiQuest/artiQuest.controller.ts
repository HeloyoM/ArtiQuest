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
        const keys = await this.cacheManager.store.keys();

        let storedInprogressArticles = []
        for (const key of keys) {
            const splittedKey = key.split('-')
            const inprogressKey = splittedKey.slice(0, 2).join('-')
            if (inprogressKey === CacheKeys.IN_PROGRESS) {
                const ttl = await this.cacheManager.store.ttl(key)
                const art: any = await this.cacheManager.get(key)
                art.ttl = ttl
                storedInprogressArticles.push(art)
            }
        }

        return storedInprogressArticles
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${IN_PROGRESS}/findByAuthor`)
    async getInprogressArtsByAuthorId(@Request() req) {
        const author_id = req.user.userId;

        const keys = await this.cacheManager.store.keys()

        let storedInprogressArticles = []
        for (const key of keys) {
            const splittedKey = key.split('-')
            const storedAuthorId = splittedKey.slice(2, 7).join('-')
            const inprogressKey = splittedKey.slice(0, 2).join('-')

            if (inprogressKey === CacheKeys.IN_PROGRESS) {
                if (storedAuthorId === author_id) {
                    const ttl = await this.cacheManager.store.ttl(key)
                    const art: any = await this.cacheManager.get(key)
                    art.ttl = ttl
                    storedInprogressArticles.push(art)
                }
            }
        }

        return storedInprogressArticles
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
        const [artToReturn] = await this.artService.assignAuthors([assignedCategory])

        artToReturn.id = randomUUID()
        artToReturn.created = new Date().toLocaleDateString()
        artToReturn.active = false
        artToReturn.viewers = []
        artToReturn.rank = { total: 0, voters: [] }
        artToReturn.body = content

        await this.cacheManager.set(`${CacheKeys.IN_PROGRESS}-${author_id}-${artToReturn.id}`, artToReturn, 3_600_000 /* hour */)

        return artToReturn
    }

    @UseGuards(JwtAuthGuard)
    @Get('interest')
    async getUserCategoryInterest(@Request() req) {
        return this.artService.getUserCategoryInterest(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get(`${IN_PROGRESS}/findByAuthor`)
    async getAllPrivateInprogressArts(@Request() req) {
        const authorId = req.user.userId
        const keys = await this.cacheManager.store.keys()

        let storedInprogressArticles = []
        for (const key of keys) {
            if (key === CacheKeys.IN_PROGRESS) {
                storedInprogressArticles = await this.cacheManager.get(`${CacheKeys.IN_PROGRESS}-${key.slice(11, -1)}`)
            }
        }

        const userInprogressArts = storedInprogressArticles.filter((a: Article) => {
            if (typeof a.author !== 'string') {
                return a.author.id === authorId
            }
        })
        return userInprogressArts
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArt(@Body() art: Article) {
        const key = `ARTICLES_HAVE_BEEN_UPDATED`
        await this.cacheManager.set(key, true, 3_600_000 /* hour */)
        const keys = await this.cacheManager.store.keys();

        let storedInprogressArticles = [];
        for (const key of keys) {
            if (key === CacheKeys.IN_PROGRESS)
                storedInprogressArticles = await this.cacheManager.get(key);
        }
        const uploadedArticle = storedInprogressArticles.find((a: Article) => a.id === art.id)

        uploadedArticle.author = uploadedArticle.author.id
        uploadedArticle.cat = uploadedArticle.cat.id
        uploadedArticle.sub_title = art.sub_title ? art.sub_title : uploadedArticle.sub_title
        uploadedArticle.body = art.body ? art.body : uploadedArticle.body
        uploadedArticle.title = art.title ? art.title : uploadedArticle.title

        await this.artService.createArt(uploadedArticle)

        return uploadedArticle
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
        console.log({ isUpdated })
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
    async createCategory(@Body() cat: any) {
        return await this.artService.createCategory(cat)
    }
}