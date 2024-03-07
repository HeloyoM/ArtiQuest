import { UpdateUserDto } from "src/Auth/dto/UpdateUser.dto"
import { User } from "src/interface/user.interface"

export interface IUserQuery {
    findAll(): Promise<User[]>
    getUserById(id: string): Promise<User>
    create(user: User): Promise<User>
    remove(id: string): void
    update(id: string, user: UpdateUserDto): Promise<User | string>
}