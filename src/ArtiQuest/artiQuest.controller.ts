import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common'
import { ArtiQuestService } from './artiQuest.service'
import { Article } from 'src/interface/Article.interface'

@Controller('art')
export class ArtiQuestController {
    constructor(
        private artService: ArtiQuestService
    ) { }

    @Get()
    async getAllArticles() {
        return this.artService.getAllArticles()
    }

    @Get('/findBy/:cat')
    async getArticlesByCategoryId(@Param('cat') id: string) {
        return await this.artService.getArticlesByCategoryId(id)
    }

    @Get('/findOne/:id')
    getArticleById(@Param('id') id: string) {
        return this.artService.getArticleById(id)
    }

    @Get('/cat')
    getAllCategories() {
        return this.artService.getAllCategories()
    }

    @Get('/cat/findOne/:id')
    getCategoryById(@Param('id') id: string) {
        return this.artService.getCategoryById(id)
    }

    @Post()
    async post(@Body() art: Article) {
        await this.artService.createArt(art)
    }

    @Put(':id')
    async put(
        @Param('id') id: string,
        @Body() art: Article
    ) {
        return await this.artService.updateArt(id, art)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.artService.remove(id)
    }
}