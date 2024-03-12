import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { UserService } from './user/user.service'
import { AceessTokenPayload } from './models/token.model'

import { User } from 'src/interface/user.interface'
import { LoginResultDto } from './dto/loginResult.dto'
import AuthDatabaseAccess from 'src/database/Auth/databaseAccess'
import { IUserSession } from 'src/database/Auth/interface/IUserSession.interface'

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly authDatabaseAccess: AuthDatabaseAccess
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

        const expTime = this.jwtService.verify(token).exp

        const session: IUserSession = {
            user_id: user.id,
            session_id: token,
            expires_at: expTime
        }

        this.authDatabaseAccess.save(session)

        return new LoginResultDto(token)
    }

    async logout(user_id: string) {
        await this.authDatabaseAccess.remove(user_id)
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