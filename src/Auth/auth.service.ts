import { Injectable } from '@nestjs/common'
import { User } from 'src/interface/user.interface'
import { UserService } from './user/user.service'
import * as bcrypt from 'bcryptjs'
import { LoginResult } from './models/Login.model'
import { AceessTokenPayload } from './models/Token.model'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async login(email: string, password: string) {
        const user = await this.userService.getUserById(email)
        console.log(user)
        if (user == null) return null

        if (user == null || !user.active) return null

        if (!(await bcrypt.compare(password, user.password))) return null

        const payload = { id: user.id, email: user.email }
        const token = await this.generateAccessToken(payload)

        console.log(token)
        return new LoginResult(user, token)
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