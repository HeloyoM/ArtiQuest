import { Injectable } from '@nestjs/common'
import UserDatabaseAccess from '../../database/User/userDatabaseAccess'
import { User } from '../../interface/user.interface'
import { UpdateUserDto } from '../dto/UpdateUser.dto'
import { ContactMsgDto } from '../dto/contectMsg.dto'

@Injectable()
export class UserService {

    constructor(private readonly userDatabaseAccess: UserDatabaseAccess) { }

    async getUserById(id: string) {
        return this.userDatabaseAccess.getUserById(id)
    }

    async findAll(): Promise<User[]> {
        return await this.userDatabaseAccess.findAll()
    }

    async createUser(user: User): Promise<User> {
        return await this.userDatabaseAccess.create(user)
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<User | string> {
        return await this.userDatabaseAccess.update(id, user)
    }

    async remove(id: string): Promise<string> {
        return await this.userDatabaseAccess.remove(id)
    }

    receiveMsgFromUser(payload: ContactMsgDto) {
        this.userDatabaseAccess.receiveMsgFromUser(payload)
    }


}