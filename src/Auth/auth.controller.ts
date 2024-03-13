import { Controller, Request, UseGuards, Post, Patch, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local/local-auth.guard'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Body() payload: LoginDto,
        @Request() req
    ) {
        return await this.authService.login(req.user, payload)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('logout')
    async logout(@Request() req) {
        await this.authService.logout(req.user.userId)
    }

    @Post('refresh-token')
    async refreshToken(
        @Request() req
    ) {
        if (req.headers.authorization)
            return await this.authService.refreshToken(req.headers.authorization)
    }
}