import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './ArtiQuest/artiQuest.module'

@Module({
  imports: [
    ArtiQuestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
