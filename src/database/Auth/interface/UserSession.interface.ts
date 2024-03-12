import { IUserSession } from "./IUserSession.interface"

export interface IUserSessionQuery {
    save(session: IUserSession): Promise<void>

    remove(user_id: string): Promise<void>

    findSessionByUserIdAndSessionId(user_id: string, session_id: string): Promise<IUserSession | boolean>

}