import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '../secret'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: jwtConstants.secret, //consider using PEM-encoded public key on production
        })
    }

    async validate(payload: any) {
        /*
        Could do a database lookup
        in here to extract more information
        about the user
         */
        return { userId: payload.sub, username: payload.username, role: payload.role }
    }
}