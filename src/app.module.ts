import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './artiQuest/artiQuest.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './Auth/auth.module'
import { AboutModule } from './about/about.module'
import { CacheModule } from '@nestjs/cache-manager'
import { PostModule } from './posts/post.module'

@Module({
  imports: [
    ArtiQuestModule,

    ProductModule,

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
