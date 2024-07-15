import { Controller, Request, Get, Post, Delete, Put, Body, Param, UseGuards, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '../../interface/user.interface'
import { JwtAuthGuard } from '../jwt/jwt-auth.guard'
import { UpdateUserDto } from '../dto/UpdateUser.dto'
import { ContactMsgDto } from '../dto/contectMsg.dto'

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

    @UseGuards(JwtAuthGuard)
    @Post('/contact')
    async contact(@Request() req, @Body() payload: ContactMsgDto) {
        this.userService.receiveMsgFromUser(payload, req.user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async put(
        @Body() user: UpdateUserDto,
        @Request() req,
    ) {
        return await this.userService.updateUser(req.user.userId, user)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<string> {
        return await this.userService.remove(id)
    }
}