import { User } from "../../interface/user.interface"

export interface ContactMsgDto {
    sender: Partial<User>
    msg: string
    topic: string
}