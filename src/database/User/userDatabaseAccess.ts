import { join } from "path"
import * as fs from 'fs'
import { Injectable } from "@nestjs/common"
import { IUserQuery } from "./interface/UserQuery.interface"
import { User } from "../../interface/user.interface"
import { randomUUID } from "crypto"
import { UpdateUserDto } from "../../Auth/dto/UpdateUser.dto"
import { updateUserFields } from '../../utils/updateUserUtil'
import { hashingPassword } from "../../utils/hashingPassword"

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
        const usersList = []
        for (const u of this.users) {

            const { password, ...result } = u

            usersList.push(result)
        }
        return usersList
    }

    async create(user: User): Promise<User> {
        user.password = await hashingPassword(user.password)
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

    async update(id: string, user: UpdateUserDto): Promise<User | string> {
        const userToUpdate = this.users.find(a => a.id.toString() === id.toString())

        if (!userToUpdate)
            throw Error(`Unable to find user with given id: ${id}`)

        const updatedUser = await updateUserFields(userToUpdate, user)

        if (updatedUser) {



            const newUsersArray = this.users.map((u: User) => {
                if (u.id.toString() === id.toString()) return updatedUser

                else return u
            })

            this.users = newUsersArray

            //query will replace it
            fs.writeFile(this.path, JSON.stringify(this.users), 'utf-8', (err) => {

                if (err)
                    throw Error(`Something went wrong whild updating user details, given id ${id}`)

                else return 'user updated successfully'
            })

            return updatedUser
        } else {
            return 'The new password is similar to your correctly password'
        }
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