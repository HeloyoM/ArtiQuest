import { Product } from "./Product.interface"

export interface IProductQuery {
    findAll(): Promise<Product[]>
    create(product: Product): void
    remove(id: string): void
    update(id: string, product: Product): Promise<Product>
}