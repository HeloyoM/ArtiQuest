import { join } from "path"
import * as fs from 'fs'
import { Injectable } from "@nestjs/common"
import { IUserQuery } from "./interface/UserQuery.interface"
import * as bcrypt from 'bcryptjs'
import { User } from "src/interface/user.interface"
import { randomUUID } from "crypto"

@Injectable()
class UserDatabaseAccess implements IUserQuery {
    path = join(__dirname, '../../../data/users.data.json')

    users: User[] = []

    constructor() {
        this.init()
    }

    init() {
        const file = fs.readFileSync(this.path, 'utf-8')
        const usersList = JSON.parse(file)

        for (const a of usersList) {
            this.users.push(a)
        }
    }

    async getUserById(id: string): Promise<User> {
        return this.users.find(u => u.email === id)
    }

    async findAll(): Promise<User[]> {
        return this.users
    }

    async create(user: User): Promise<User> {
        user.password = await bcrypt.hash(user.password, 12)
        user.active = true
        user.id = randomUUID()
        user.joined = new Date()

        this.users.push(user)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.users), 'utf-8', (err) => {
            if (err)
                throw Error(`Something went wrong while new user registered: ${err}`)

            else return 'user registered successfully'
        })

        return user
    }

    async update(id: string, user: User): Promise<User> {
        const userToUpdate = this.users.find(a => a.id.toString() === id.toString())

        if (!userToUpdate)
            throw Error(`Unable to find user with given id: ${id}`)

        user.password = await bcrypt.hash(user.password, 12)

        const newUsersArray = this.users.map((u: User) => {
            if (u.id.toString() === id.toString()) return user

            else return u
        })

        this.users = newUsersArray

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.users), 'utf-8', (err) => {

            if (err)
                throw Error(`Something went wrong whild updating user details, given id ${user.id}`)

            else return 'user updated successfully'
        })

        return user
    }

    async remove(id: string): Promise<string> {
        this.users = this.users.filter(a => a.id !== id)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.users), 'utf-8', (err) => {
            if (err)
                throw Error(`Error occuer while removing user [${id}]`)


            else return 'user removed'
        })

        return id
    }
}
export default UserDatabaseAccess