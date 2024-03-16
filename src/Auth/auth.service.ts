import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { UserService } from './user/user.service'
import { AceessTokenPayload } from './models/token.model'

import { LoginResultDto } from './dto/loginResult.dto'
import AuthDatabaseAccess from 'src/database/Auth/databaseAccess'
import { IUserSession } from 'src/database/Auth/interface/IUserSession.interface'
import { LoginDto } from './dto/login.dto'

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

    async login(user: any, loginPayload: LoginDto) {
        const payload = { sub: user.id, rememberMe: loginPayload.rememberUser }

        const token = await this.generateAccessToken(payload)

        return new LoginResultDto(token)
    }

    async logout(user_id: string) {
        await this.authDatabaseAccess.remove(user_id)
    }

    async generateAccessToken(payload: AceessTokenPayload): Promise<string> {
        const token = await this.jwtService.signAsync(payload, { expiresIn: '5s' })

        if (token)
            await this.updateUsersSession(token)

        return token
    }

    async updateUsersSession(token: string) {
        const decoded = this.jwtService.decode(token)

        const session: IUserSession = {
            expires_at: decoded.exp,
            session_id: token,
            user_id: decoded.sub
        }

        await this.authDatabaseAccess.save(session)
    }

    /**
        3 @conditions  
        - refresh token - issue new token
        - logout - null
        - not expires - current token
    */
    async refreshToken(token: string) {
        const accessToken = token.split(' ')[1]

        const decoded = await this.jwtService.decode(accessToken)

        const userSession = await this.authDatabaseAccess.findSessionByUserIdAndSessionId(decoded.sub, accessToken)

        const currentTime = Math.floor(Date.now() / 1000)

        const expirationTime = userSession.expires_at || 0

        if (currentTime >= expirationTime) {

            if (decoded.rememberMe) {

                const payload = { sub: decoded.sub, rememberMe: decoded.rememberMe }

                const accessToken = await this.generateAccessToken(payload)

                return accessToken

            } else {
                await this.logout(decoded.sub)

                return null
            }
        } else return userSession.session_id
    }

}