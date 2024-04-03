import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './artiQuest/artiQuest.module'
import { AuthModule } from './auth/auth.module'
import { AboutModule } from './about/about.module'
import { CacheModule } from '@nestjs/cache-manager'
import { PostModule } from './posts/post.module'

@Module({
  imports: [
    ArtiQuestModule,

    AuthModule,

    AboutModule,

    PostModule,

    CacheModule.register({
      isGlobal: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
