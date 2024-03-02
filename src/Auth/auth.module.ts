import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserService } from './user/user.service'
import userDatabaseAccess from 'src/database/User/userDatabaseAccess'
import { UserController } from './user/user.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './secret'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local/local.strategy'
import { JwtStrategy } from './jwt/jwt.strategy'
@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '14400s' }, // too short
        }),
    ],
    controllers: [AuthController, UserController],
    providers: [UserService, AuthService, userDatabaseAccess, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
