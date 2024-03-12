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

        return new LoginResultDto(token)
    }

    async logout(user_id: string) {
        await this.authDatabaseAccess.remove(user_id)
    }


    async generateAccessToken(payload: AceessTokenPayload): Promise<string> {
        const token = await this.jwtService.signAsync(payload)
        console.log({ token })
        if (token) {
            const { exp } = this.jwtService.decode(token)
            console.log({ exp })
            const session: IUserSession = {
                expires_at: exp,
                session_id: token,
                user_id: payload.sub
            }
            console.log({ session })
            await this.authDatabaseAccess.save(session)
        }

        return token
    }

    async getAllUsers(): Promise<User[]> {
        return [] as User[]
    }

    async refreshToken(token: string) {
        const accessToken = token.split(' ')[1]
        // if (!this.jwtService.verify(token.split(' ')[1])) {
        const decoded = await this.jwtService.decode(accessToken)
        console.log(decoded)
        if (decoded) {
            const userSession = await this.authDatabaseAccess.findSessionByUserIdAndSessionId(decoded.sub, accessToken)

            const currentTime = Math.floor(Date.now() / 1000)

            const expirationTime = userSession.expires_at || 0

            if (currentTime >= expirationTime) {

                const payload = { sub: decoded.sub }

                const accessToken = await this.generateAccessToken(payload)

                return accessToken
            } else return
        }

    }
    async getUserById(id: string) {

    }

    async createUser() {

    }

}