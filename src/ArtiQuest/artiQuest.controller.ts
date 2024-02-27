import { Controller, Request, Get, Post, Delete, Put, Body, Param, Patch, UseGuards } from '@nestjs/common'
import { ArtiQuestService } from './artiQuest.service'
import { Article } from 'src/interface/Article.interface'
import { EditPayloadDto } from './dto/editPayload.dto'

@Controller('art')
export class ArtiQuestController {
    constructor(
        private artService: ArtiQuestService
    ) { }

    @Get()
    async getAllArticles() {
        return await this.artService.getAllArticles()
    }

    @Get('/findBy/:cat')
    async getArticlesByCategoryId(@Param('cat') id: string) {
        return await this.artService.getArticlesByCategoryId(id)
    }

    @Get('/findOne/:id')
    async getArticleById(@Param('id') id: string) {
        return await this.artService.getArticleById(id)
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

    @Patch(':id')
    async editArticle(@Param('id') id: string, @Body() payload: EditPayloadDto) {
        return await this.artService.editArticle(id, payload)
    }

    @Patch('rate/:id')
    async rateArticle(@Param('id') id: string) {
        return await this.artService.rate(id)
    }


    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.artService.remove(id)
    }
}