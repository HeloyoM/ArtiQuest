import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './ArtiQuest/artiQuest.module'
import { ProductModule } from './product/product.module'

@Module({
  imports: [
    ArtiQuestModule,

    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
