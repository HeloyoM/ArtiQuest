import { Controller, Request, UseGuards, Post, Patch } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local/local-auth.guard'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('logout')
    async logout(@Request() req) {
        console.log({ req })
        await this.authService.logout(req.user.userId)
    }
}