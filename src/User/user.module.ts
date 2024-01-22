import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, UserDatabaseAccess],
})
export class UserModule { }
