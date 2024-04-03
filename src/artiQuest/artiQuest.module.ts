import { Module } from '@nestjs/common'
import { ArtiQuestController } from './artiQuest.controller'
import { ArtiQuestService } from './artiQuest.service'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import UserDatabaseAccess from '../database/User/userDatabaseAccess'

@Module({
    imports: [],
    controllers: [ArtiQuestController],
    providers: [ArtiQuestService, ArtDatabaseAccess, UserDatabaseAccess],
})
export class ArtiQuestModule { }
