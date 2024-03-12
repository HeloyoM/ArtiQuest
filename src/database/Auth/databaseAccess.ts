import { join } from "path"
import * as fs from 'fs'
import { Injectable, Logger } from "@nestjs/common"
import { IUserSessionQuery } from "./interface/UserSession.interface"
import { IUserSession } from "./interface/IUserSession.interface"


@Injectable()
class AuthDatabaseAccess implements IUserSessionQuery {
    private readonly logger = new Logger(AuthDatabaseAccess.name)
    path = join(__dirname, '../../../data/users-session.data.json')
    sessions: IUserSession[] = []

    constructor() {
        this.init()
    }

    init() {
        const file = fs.readFileSync(this.path, 'utf-8')
        const sessions = JSON.parse(file)

        for (const s of sessions) {
            this.sessions.push(s)
        }
    }

    async save(session: IUserSession): Promise<void> {

        this.sessions.push(session)

        fs.writeFile(this.path, JSON.stringify(this.sessions), 'utf-8', (err) => {

            if (err)
                this.logger.error(`Something went wrong while creating new session with given id ${session.user_id}`)

            else this.logger.log('new sessions created successfully')
        })
    }

    async remove(user_id: string): Promise<void> {
        this.sessions = this.sessions.filter((s: IUserSession) => s.user_id !== user_id)

        fs.writeFile(this.path, JSON.stringify(this.sessions), 'utf-8', (err) => {

            if (err)
                this.logger.error(`Something went wrong while creating new session with given id ${user_id}`)

            else this.logger.log('new sessions created successfully')
        })
    }

    async findSessionByUserIdAndSessionId(user_id: string, session_id: string): Promise<IUserSession> {
        const session = this.sessions.find((s: IUserSession) => s.user_id === user_id && s.session_id === session_id)

        if (session)
            return session

        else false
    }

    async logout(user_id: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
}

export default AuthDatabaseAccess
