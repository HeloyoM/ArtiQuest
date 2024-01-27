import { Controller, Get, Post, Delete, Put, Body } from '@nestjs/common'
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get()
    get() { }

    @Post('login')
    async post(@Body() payload: LoginDto): Promise<any> {
        return await this.authService.login(payload.email, payload.password)
    }

    @Put()
    put() { }

    @Delete()
    delete() { }
}