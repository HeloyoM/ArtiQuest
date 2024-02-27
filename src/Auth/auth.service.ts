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
        console.log(user)
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email }

        const token = await this.generateAccessToken(payload)

        return new LoginResultDto(user, token)
    }

    // async login(email: string, pass: string) {
    //     const user = await this.userService.getUserById(email)
    //     console.log(user.password, pass)
    //     if (!(await bcrypt.compare(pass, user.password))) {
    //         throw new UnauthorizedException()
    //     }
    //     const { password, ...result } = user

    //     const payload = { sub: result.id, email: result.email }

    //     const token = await this.generateAccessToken(payload)

    //     return new LoginResultDto(user, token)

    // const user = await this.userService.getUserById(email)

    // if (user == null) return null

    // if (user == null || !user.active) return null

    // if (!(await bcrypt.compare(password, user.password))) return null

    // const payload = { sub: user.id, email: user.email }

    // const token = await this.generateAccessToken(payload)

    // return new LoginResultDto(user, token)
    // }

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