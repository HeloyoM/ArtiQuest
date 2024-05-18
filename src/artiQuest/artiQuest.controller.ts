import { Controller, Request, Get, Post, Delete, Put, Body, Param, Patch, UseGuards, Inject, UseInterceptors, UploadedFile } from '@nestjs/common'
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

    //arts
    @Get()
    async getAllArticles() {
        return await this.artService.getAllArticles()
    }

    @UseGuards(JwtAuthGuard)
    @Post('init-art')
    @UseInterceptors(FileInterceptor('file'))
    async initalArticleBeforeUpload(
        @Request() req,
        @Body() art: { art: string },
        @UploadedFile() file: Express.Multer.File,
    ) {
        const data = this.pdfExtract.extractBuffer(file.buffer)

        const content = (await data).pages.reduce((acc, page) => {
            const contentStrings = page.content.map(item => item.str.trim()).filter(str => str !== '');

            return acc.concat(contentStrings)
        }, []).join(' ')

        const parsedArticle = JSON.parse(art.art)

        const [assignedCategory] = this.artService.assignCategories([parsedArticle])
        assignedCategory.author = req.user.userId
        const [artToReturn] = await this.artService.assignAuthors([assignedCategory])

        artToReturn.id = randomUUID()
        artToReturn.created = new Date().toLocaleDateString()
        artToReturn.active = false
        artToReturn.viewers = []
        artToReturn.rank = { total: 0, voters: [] }
        artToReturn.body = content

        return artToReturn
    }

    @UseGuards(JwtAuthGuard)
    @Get('interest')
    async getUserCategoryInterest(@Request() req) {
        return this.artService.getUserCategoryInterest(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArt(@Body() art: Article) {
        const key = `ARTICLES_HAVE_BEEN_UPDATED`
        await this.cacheManager.set(key, true, 24 * 3600 /* hour */)

        return await this.artService.createArt(art)
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
        const key = `ARTICLES_HAVE_BEEN_UPDATED`
        await this.cacheManager.set(key, true, 24 * 3600 /* hour */)

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

            await this.cacheManager.set(key, categoryContent, 24 * 3600 /* hour */)
        }

        return categoryContent
    }

    @Get('/findOne/:id')
    async getArticleById(@Param('id') id: string) {
        const key = `article_${id}`

        let articleContent = await this.cacheManager.get(key)

        if (articleContent == null) {
            articleContent = await this.artService.getArticleById(id)

            await this.cacheManager.set(key, articleContent, 24 * 3600 /* hour */)
        }

        return articleContent
    }

    @Get('/cat')
    getAllCategories() {
        return this.artService.getAllCategories()
    }

    @Get('/cat/findOne/:id')
    getCategoryById(@Param('id') id: string) {
        return this.artService.getCategoryById(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/cat')
    async createCategory(@Body() cat: any) {
        return await this.artService.createCategory(cat)
    }
}