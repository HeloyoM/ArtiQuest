import { IPost } from "../../../interface/Post.interface"
import { CreatePostDto } from "../../../posts/dto/CreatePost.dto"

export interface IPostQuery {
    createPost(id: string, payload: CreatePostDto): Promise<IPost>
}