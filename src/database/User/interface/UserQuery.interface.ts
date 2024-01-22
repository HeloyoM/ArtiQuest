import { User } from './IUser.interface'

export interface IUserQuery {
    findAll(): Promise<User[]>
    create(user: User): void
    remove(id: string): void
    update(id: string, user: User): Promise<User>
}