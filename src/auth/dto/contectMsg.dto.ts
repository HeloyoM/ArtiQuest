import { RawDraftContentState } from "src/interface/RawDraftContentState.interface"
import { User } from "../../interface/user.interface"

export interface ContactMsgDto {
    sender: Partial<User>
    msg: RawDraftContentState
    topic: string
}