import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from 'src/database/User/interface/IUser.interface'

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    async get() {
        return this.userService.findAll()
    }

    @Post()
    async post(@Body() user: User) {
        await this.userService.createArt(user)
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