import { Controller, Get, Post, Delete, Put } from '@nestjs/common'

@Controller()
export class PostController {
    constructor() { }

    @Get()
    get() { }

    @Post()
    post() { }

    @Put()
    put() { }

    @Delete()
    delete() { }
}