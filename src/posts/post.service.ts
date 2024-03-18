import { Injectable } from '@nestjs/common'
import PostDatabaseAccess from 'src/database/Post/databaseAccess'
import { CreatePostDto } from './dto/CreatePost.dto'

@Injectable()
export class PostService {

    constructor(
        private readonly postDatabaseAccess: PostDatabaseAccess,
    ) { }


    async getAllPosts(){
        return this.postDatabaseAccess.getPosts()
    }

    async createPost(id: string, payload: CreatePostDto) {
        return await this.postDatabaseAccess.createPost(id, payload)
    }
}