import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import PostDatabaseAccess from 'src/database/Post/databaseAccess'
import { PostService } from './post.service'
import ArtDatabaseAccess from 'src/database/ArtiQuest/databaseAccess'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'
import { ArtiQuestService } from 'src/artiQuest/artiQuest.service'

@Module({
    imports: [],
    controllers: [PostController],
    providers: [PostDatabaseAccess, ArtiQuestService, ArtDatabaseAccess,UserDatabaseAccess, PostService],
})
export class PostModule { }
