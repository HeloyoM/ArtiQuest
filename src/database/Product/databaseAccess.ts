import { Injectable } from "@nestjs/common"
import { Product } from "./interface/Product.interface"
import { join } from "path"
import * as fs from 'fs'

@Injectable()
class ProductDatabaseAccess {
    product: Product[] = []

    constructor() {
        this.init()
    }

    init() {
        const path = join(__dirname, '../../../data/products.data.json')

        const file = fs.readFileSync(path, 'utf-8')
        const productsList = JSON.parse(file).products

        for (const a of productsList) {
            this.product.push(a)
        }
    }


    async findAll(): Promise<Product[]> {
        return this.product
    }

}

export default ProductDatabaseAccess