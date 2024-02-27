import { Controller, Request, UseGuards, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local/local-auth.guard'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }
}