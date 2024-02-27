import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { UserService } from './user/user.service'
import { AceessTokenPayload } from './models/token.model'

import { User } from 'src/interface/user.interface'
import { LoginResultDto } from './dto/loginResult.dto'

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.getUserById(email)

        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user
            
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { sub: user.id }

        const token = await this.generateAccessToken(payload)

        return new LoginResultDto(token)
    }

    async generateAccessToken(payload: AceessTokenPayload): Promise<string> {
        return this.jwtService.signAsync(payload)
    }

    async getAllUsers(): Promise<User[]> {
        return [] as User[]
    }

    async getUserById(id: string) {

    }

    async createUser() {

    }

}