import { Controller, Request, Get, Post, Delete, Put, Body, Param, Patch, UseGuards, Inject } from '@nestjs/common'
import { ArtiQuestService } from './artiQuest.service'
import { Article } from 'src/interface/Article.interface'
import { EditPayloadDto } from './dto/editPayload.dto'
import { JwtAuthGuard } from 'src/Auth/jwt/jwt-auth.guard'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Controller('art')
export class ArtiQuestController {
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
    @Get('interest')
    async getUserCategoryInterest(@Request() req) {
        return this.artService.getUserCategoryInterest(req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createArt(@Body() art: Article) {
        await this.artService.createArt(art)
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

        if (categoryContent == null) {
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