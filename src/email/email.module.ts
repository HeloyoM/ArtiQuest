import { Module, forwardRef } from '@nestjs/common'
import { ArtiQuestModule } from 'src/artiQuest/artiQuest.module';
import { ArtiQuestService } from 'src/artiQuest/artiQuest.service';
import { MailService } from './email.service';
import ArtDatabaseAccess from 'src/database/ArtiQuest/databaseAccess';
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess';

@Module({
    imports: [forwardRef(() => ArtiQuestModule)],
    controllers: [],
    providers: [ArtiQuestService, MailService, ArtDatabaseAccess, UserDatabaseAccess],
})
export class MailModule { }
