import { join } from "path"
import * as fs from 'fs'
import { Injectable } from "@nestjs/common"
import { IUserQuery } from "./interface/UserQuery.interface"
import { User } from "./interface/IUser.interface"

@Injectable()
class UserDatabaseAccess implements IUserQuery {
    users: User[] = []

    constructor() {
        this.init()
    }

    init() {
        const path = join(__dirname, '../../../data/users.data.json')

        const file = fs.readFileSync(path, 'utf-8')
        const usersList = JSON.parse(file).users

        for (const a of usersList) {
            this.users.push(a)
        }
    }

    async findAll(): Promise<User[]> {
        return this.users
    }

    async create(user: User): Promise<void> {
        this.users.push(user)
    }

    async update(id: string, user: User): Promise<User> {
        const userToUpdate = this.users.find(a => a.id.toString() === id.toString())

        if (!userToUpdate)
            throw Error(`Unable to find user with given id: ${id}`)

        const userIndex = this.users.findIndex(a => a.id == id)

        this.users = [user, ...this.users.slice(userIndex + 1, this.users.length)]

        return user
    }

    async remove(id: string): Promise<string> {
        this.users = this.users.filter(a => a.id !== id)

        return id
    }
}
export default UserDatabaseAccess