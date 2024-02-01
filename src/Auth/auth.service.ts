import { Injectable } from '@nestjs/common'
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

    async login(email: string, password: string) {
        const user = await this.userService.getUserById(email)

        if (user == null) return null

        if (user == null || !user.active) return null

        if (!(await bcrypt.compare(password, user.password))) return null

        const tokenPayload = { id: user.id, email: user.email }
        const token = await this.generateAccessToken(tokenPayload)

        return new LoginResultDto(user, token)
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