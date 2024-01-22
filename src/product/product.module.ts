import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import ProductDatabaseAccess from 'src/database/Product/databaseAccess'

@Module({
    imports: [],
    controllers: [ProductController],
    providers: [ProductService, ProductDatabaseAccess],
})
export class ProductModule { }
