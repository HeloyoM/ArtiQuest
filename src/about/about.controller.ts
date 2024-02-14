import { Controller, Get, Post, Delete, Put } from '@nestjs/common'
import { AboutService } from './about.service';

@Controller('about')
export class AboutController {
    constructor(private readonly aboutService: AboutService) { }

    @Get()
    get() {
        return this.aboutService.getCV()
    }

    @Post()
    post() { }

    @Put()
    put() { }

    @Delete()
    delete() { }
}