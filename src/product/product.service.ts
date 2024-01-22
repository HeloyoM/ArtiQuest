import { Injectable } from '@nestjs/common'
import ProductDatabaseAccess from '../database/Product/databaseAccess'
import { Product } from 'src/database/Product/interface/Product.interface'

@Injectable()
export class ProductService {

    constructor(private readonly productDatabaseAccess: ProductDatabaseAccess) { }

    async findAll(): Promise<Product[]> {
        return await this.productDatabaseAccess.findAll()
    }

    async create(product: Product) {
        await this.productDatabaseAccess.create(product)
    }

    async remove(id: string): Promise<string> {
        return await this.productDatabaseAccess.remove(id)
    }

    async updateProduct(id: string, product: Product): Promise<Product> {
        return await this.productDatabaseAccess.update(id, product)
    }


}