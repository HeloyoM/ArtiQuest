import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Request } from '@nestjs/common'
import { CreatePostDto } from './dto/CreatePost.dto'
import { PostService } from './post.service'
import { JwtAuthGuard } from 'src/Auth/jwt/jwt-auth.guard'

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async get() {
        return await this.postService.getAllPosts()
    }

    @UseGuards(JwtAuthGuard)
    @Get('/findBy')
    async getPostsByAuthorId(@Request() req) {
        return await this.postService.getPostsByAuthorId(req.user.userId)
    }

    @Post(':id')
    async post(
        @Param('id') id: string,
        @Body() payload: CreatePostDto
    ) {
        return await this.postService.createPost(id, payload)
    }

    @Put()
    put() { }

    @Delete()
    delete() { }
}