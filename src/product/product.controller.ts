import { Controller, Get, Post, Delete, Put } from '@nestjs/common'
import { Product } from 'src/database/Product/interface/Product.interface';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    async get(): Promise<Product[]> {
        return this.productService.findAll()
    }

    @Post()
    post() { }

    @Put()
    put() { }

    @Delete()
    delete() { }
}