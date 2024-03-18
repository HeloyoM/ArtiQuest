import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import PostDatabaseAccess from 'src/database/Post/databaseAccess'

@Module({
    imports: [],
    controllers: [PostController],
    providers: [PostDatabaseAccess],
})
export class PostModule { }
