import { Module, forwardRef } from '@nestjs/common'
import { ArtiQuestController } from './artiQuest.controller'
import { ArtiQuestService } from './artiQuest.service'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import UserDatabaseAccess from '../database/User/userDatabaseAccess'
import AppCache from 'src/cache/AppCache'
import { MailService } from 'src/email/email.service'
import { MailModule } from 'src/email/email.module'

@Module({
    imports: [forwardRef(() => MailModule)],
    controllers: [ArtiQuestController],
    providers: [ArtiQuestService, MailService, ArtDatabaseAccess, UserDatabaseAccess, AppCache],
})
export class ArtiQuestModule { }
