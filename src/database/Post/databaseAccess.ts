import { join } from "path"
import * as fs from 'fs'
import { Injectable, Logger } from "@nestjs/common"
import { IPostQuery } from "./interface/IPostQuery.interface"
import { IPost } from "../../interface/Post.interface"
import { CreatePostDto } from "../../posts/dto/CreatePost.dto"
import { randomUUID } from "crypto"


@Injectable()
class PostDatabaseAccess implements IPostQuery {
    private readonly logger = new Logger(PostDatabaseAccess.name)
    path = join(__dirname, '../../../data/post.data.json')
    posts: IPost[] = []

    constructor() {
        this.init()
    }

    init() {
        const file = fs.readFileSync(this.path, 'utf-8')
        const posts = JSON.parse(file)

        for (const p of posts) {
            this.posts.push(p)
        }
    }

    async getPosts() {
        return this.posts
    }

    async createPost(id: string, payload: CreatePostDto): Promise<IPost> {
        const post: IPost = {} as IPost

        post.id = randomUUID()
        post.createdAt = new Date().toLocaleDateString()
        post.art_id = id
        post.body = payload.body
        post.sender = payload.sender
        post.category = payload.category

        this.posts.push(post)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.posts), 'utf-8', (err) => {
            if (err) {
                this.logger.error(
                    `Something went wrong whild inserting new article: ${err}`,
                )
            }

            else this.logger.log('article inserted successfully')
        })

        return post

    }
}
export default PostDatabaseAccess