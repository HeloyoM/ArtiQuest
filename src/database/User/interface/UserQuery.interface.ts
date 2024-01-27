import { User } from "src/interface/user.interface"

export interface IUserQuery {
    findAll(): Promise<User[]>
    getUserById(id: string): Promise<User>
    create(user: User): Promise<User>
    remove(id: string): void
    update(id: string, user: User): Promise<User>
}