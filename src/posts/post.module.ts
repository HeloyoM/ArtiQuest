import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import PostDatabaseAccess from 'src/database/Post/databaseAccess'
import { PostService } from './post.service'

@Module({
    imports: [],
    controllers: [PostController],
    providers: [PostDatabaseAccess, PostService],
})
export class PostModule { }
