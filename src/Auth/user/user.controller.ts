import { Controller, Request, Get, Post, Delete, Put, Body, Param, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from 'src/interface/user.interface'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }


    @Get()
    async get() {
        return this.userService.findAll()
    }

    @Post()
    async post(@Body() user: User) {
        return await this.userService.createUser(user)
    }

    @Put(':id')
    async put(
        @Param('id') id: string,
        @Body() user: User
    ) {
        return await this.userService.updateUser(id, user)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.userService.remove(id)
    }
}