import { Injectable } from '@nestjs/common'
import PostDatabaseAccess from '../database/Post/databaseAccess'
import { CreatePostDto } from './dto/CreatePost.dto'
import { ArtiQuestService } from '../artiQuest/artiQuest.service'
import bindPostsAndArticles from '../utils/bindPostsAndArticles'

@Injectable()
export class PostService {

    constructor(
        private readonly postDatabaseAccess: PostDatabaseAccess,
        private readonly artiQuestService: ArtiQuestService
    ) { }


    async getAllPosts() {
        return this.postDatabaseAccess.getPosts()
    }

    async getPostsByAuthorId(id: string) {
        const authorArts = await this.artiQuestService.getArticlesByCategoryId(id)

        const posts = await this.getAllPosts()

        return bindPostsAndArticles(authorArts, posts)
    }

    async createPost(id: string, payload: CreatePostDto) {
        return await this.postDatabaseAccess.createPost(id, payload)
    }
}