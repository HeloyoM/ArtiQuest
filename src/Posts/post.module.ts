import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import PostDatabaseAccess from '../database/Post/databaseAccess'
import { PostService } from './post.service'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import UserDatabaseAccess from '../database/User/userDatabaseAccess'
import { ArtiQuestService } from '../artiQuest/artiQuest.service'

@Module({
    imports: [],
    controllers: [PostController],
    providers: [PostDatabaseAccess, ArtiQuestService, ArtDatabaseAccess,UserDatabaseAccess, PostService],
})
export class PostModule { }
