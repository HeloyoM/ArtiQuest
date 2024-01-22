import { Module } from '@nestjs/common'
import { ArtiQuestController } from './artiQuest.controller';
import { ArtiQuestService } from './artiQuest.service';
import ArtDatabaseAccess from 'src/database/ArtiQuest/databaseAccess';

@Module({
    imports: [],
    controllers: [ArtiQuestController],
    providers: [ArtiQuestService, ArtDatabaseAccess],
})
export class ArtiQuestModule { }
