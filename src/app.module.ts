import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './artiQuest/artiQuest.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './Auth/auth.module'
import { AboutModule } from './about/about.module'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    ArtiQuestModule,

    ProductModule,

    AuthModule,

    AboutModule,

    CacheModule.register({
      isGlobal: true
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
