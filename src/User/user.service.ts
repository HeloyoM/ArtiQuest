import { Injectable } from '@nestjs/common'
import { User } from 'src/database/User/interface/IUser.interface'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'

@Injectable()
export class UserService {

    constructor(private readonly userDatabaseAccess: UserDatabaseAccess) { }

    async findAll(): Promise<User[]> {
        return await this.userDatabaseAccess.findAll()
    }

    async createArt(user: User): Promise<void> {
        await this.userDatabaseAccess.create(user)
    }

    async updateUser(id: string, user: User): Promise<User> {
        return await this.userDatabaseAccess.update(id, user)
    }

    async remove(id: string): Promise<string> {
        return await this.userDatabaseAccess.remove(id)
    }


}