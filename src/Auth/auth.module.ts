import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserService } from './user/user.service'
import userDatabaseAccess from 'src/database/User/userDatabaseAccess'
import { UserController } from './user/user.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { generateSecretKey } from './constants'

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: generateSecretKey(),
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController, UserController],
    providers: [UserService, AuthService, userDatabaseAccess],
})
export class AuthModule { }
