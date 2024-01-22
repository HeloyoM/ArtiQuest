import { Injectable } from "@nestjs/common"
import { Product } from "./interface/Product.interface"
import { join } from "path"
import * as fs from 'fs'
import { IProductQuery } from "./interface/IProductQuery.interface"

@Injectable()
class ProductDatabaseAccess implements IProductQuery {
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

    async create(product: Product): Promise<void> {
        this.product.push(product)
    }

    async update(id: string, product: Product): Promise<Product> {
        const artToUpdate = this.product.find(a => a.id.toString() === id.toString())

        if (!artToUpdate)
            throw Error(`Unable to find art with given id: ${id}`)

        const artIndex = this.product.findIndex(a => a.id == id)

        this.product = [product, ...this.product.slice(artIndex + 1, this.product.length)]

        return product
    }

    async remove(id: string): Promise<string> {
        this.product = this.product.filter(a => a.id !== id)

        return id
    }
}

export default ProductDatabaseAccess