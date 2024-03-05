import { Injectable } from '@nestjs/common'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'
import { User } from 'src/interface/user.interface'
import { UpdateUserDto } from '../dto/UpdateUser.dto'

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

    async updateUser(id: string, user: UpdateUserDto): Promise<User> {
        return await this.userDatabaseAccess.update(id, user)
    }

    async remove(id: string): Promise<string> {
        return await this.userDatabaseAccess.remove(id)
    }


}