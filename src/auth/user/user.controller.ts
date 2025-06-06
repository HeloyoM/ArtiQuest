import { Controller, Request, Get, Post, Delete, Put, Body, Param, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '../../interface/user.interface'
import { JwtAuthGuard } from '../jwt/jwt-auth.guard'
import { UpdateUserDto } from '../dto/UpdateUser.dto'
import { ContactMsgDto } from '../dto/contectMsg.dto'
import { MailService } from 'src/email/email.service'

@Controller('user')
export class UserController {
    constructor(
        private readonly mailSerivce: MailService,
        private userService: UserService) { }

    @Get()
    async get() {
        return this.userService.findAll()
    }

    @Post()
    async post(@Body() user: User) {
        return await this.userService.createUser(user)
    }

    @Post('/contact')
    async contact(@Body() payload: ContactMsgDto) {
        this.userService.receiveMsgFromUser(payload)
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