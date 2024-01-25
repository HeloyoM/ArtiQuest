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

    @Get('/findOne/:id')
    getArticleById(@Param('id') id: string) {
        console.log('cats')
        return this.artService.getArticleById(id)
    }

    @Get('/cat')
    async getAllCategories() {
        return await this.artService.getAllCategories()
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