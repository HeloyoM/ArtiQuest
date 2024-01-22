import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common'
import { ArtiQuestService } from './artiQuest.service'
import { Art } from 'src/database/ArtiQuest/interface/Art.interface'

@Controller('art')
export class ArtiQuestController {
    constructor(
        private artService: ArtiQuestService
    ) { }

    @Get()
    async get() {
        return this.artService.findAll()
    }

    @Post()
    async post(@Body() art: Art) {
        await this.artService.createArt(art)
    }

    @Put(':id')
    async put(
        @Param('id') id: string,
        @Body() art: Art
    ) {
        return await this.artService.updateArt(id, art)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.artService.remove(id)
    }
}