import { Module } from '@nestjs/common'
import { ArtiQuestModule } from './ArtiQuest/artiQuest.module'
import { ProductModule } from './Product/product.module'
import { UserModule } from './User/user.module'

@Module({
  imports: [
    ArtiQuestModule,

    ProductModule,

    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
