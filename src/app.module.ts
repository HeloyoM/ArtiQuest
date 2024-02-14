import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './artiQuest/artiQuest.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './Auth/auth.module'
import { AboutModule } from './about/about.module'

@Module({
  imports: [
    ArtiQuestModule,

    ProductModule,

    AuthModule,

    AboutModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
