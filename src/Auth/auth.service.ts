import { Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/interface/user.interface'

@Injectable()
export class UserService {

    constructor() { }

    async getAllUsers(): Promise<User[]> {
        return [] as User[]
    }

    async getUserById(id: string) {

    }

    async createUser() {

    }

}