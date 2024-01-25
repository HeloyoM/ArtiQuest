import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './artiQuest/artiQuest.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './Auth/auth.module'

@Module({
  imports: [
    ArtiQuestModule,

    ProductModule,

    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
