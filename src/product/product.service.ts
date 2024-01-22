import { Injectable } from '@nestjs/common'
import ProductDatabaseAccess from '../database/Product/databaseAccess'
import { Product } from 'src/database/Product/interface/Product.interface'

@Injectable()
export class ProductService {

    constructor(private readonly productDatabaseAccess: ProductDatabaseAccess) { }

    async findAll(): Promise<Product[]> {
        return await this.productDatabaseAccess.findAll()
    }

    create() {

    }



}