import { Product } from "./Product.interface"

export interface IProductQuery {
    findAll(): Product[]
    create(product: Product): void
    remove(id: string): void
    update(product: Product): void
}