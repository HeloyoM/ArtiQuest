import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common'
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
    async post(@Body() product: Product) { 
        return this.productService.create(product)
    }

    @Put(':id')
    async put(
        @Param('id') id: string,
        @Body() art: Product
    ) {
        return await this.productService.updateProduct(id, art)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.productService.remove(id)
    }
}