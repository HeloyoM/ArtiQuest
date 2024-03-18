import { IPost } from "src/interface/Post.interface"
import { CreatePostDto } from "src/posts/dto/CreatePost.dto"

export interface IPostQuery {
    createPost(id: string, payload: CreatePostDto): Promise<IPost>
}