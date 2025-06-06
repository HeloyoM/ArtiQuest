import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserService } from './user/user.service'
import userDatabaseAccess from '../database/User/userDatabaseAccess'
import { UserController } from './user/user.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './secret'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local/local.strategy'
import { JwtStrategy } from './jwt/jwt.strategy'
import AuthDatabaseAccess from '../database/Auth/databaseAccess'
import { MailService } from 'src/email/email.service'
import { ArtiQuestModule } from 'src/artiQuest/artiQuest.module'
import { ArtiQuestService } from 'src/artiQuest/artiQuest.service'
import ArtDatabaseAccess from 'src/database/ArtiQuest/databaseAccess'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '900000s' },
        }),
    ],
    controllers: [AuthController, UserController],
    providers: [UserService, AuthService, ArtiQuestService, ArtDatabaseAccess, MailService, ArtiQuestModule, userDatabaseAccess, AuthDatabaseAccess, LocalStrategy, JwtStrategy],
})
export class AuthModule { }
