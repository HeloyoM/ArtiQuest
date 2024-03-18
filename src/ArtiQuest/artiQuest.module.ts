import { Module } from '@nestjs/common'
import { ArtiQuestController } from './artiQuest.controller'
import { ArtiQuestService } from './artiQuest.service'
import ArtDatabaseAccess from 'src/database/ArtiQuest/databaseAccess'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'

@Module({
    imports: [],
    controllers: [ArtiQuestController],
    providers: [ArtiQuestService, ArtDatabaseAccess, UserDatabaseAccess],
})
export class ArtiQuestModule { }
