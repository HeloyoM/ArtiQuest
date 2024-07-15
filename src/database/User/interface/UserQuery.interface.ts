import { ContactMsgDto } from "src/auth/dto/contectMsg.dto"
import { UpdateUserDto } from "../../../auth/dto/UpdateUser.dto"
import { User } from "../../../interface/user.interface"

export interface IUserQuery {
    findAll(): Promise<User[]>
    getUserById(id: string): Promise<User>
    create(user: User): Promise<User>
    remove(id: string): void
    update(id: string, user: UpdateUserDto): Promise<User | string>
    receiveMsgFromUser(payload: ContactMsgDto, sender_id?: string): void
}