import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserService } from './user/user.service'
import userDatabaseAccess from 'src/database/User/userDatabaseAccess'
import { UserController } from './user/user.controller'

@Module({
    imports: [],
    controllers: [AuthController, UserController],
    providers: [UserService, userDatabaseAccess],
})
export class AuthModule { }
