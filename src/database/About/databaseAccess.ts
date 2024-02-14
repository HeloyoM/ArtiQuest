import { join } from "path"
import * as fs from 'fs'
import { Injectable, Logger } from "@nestjs/common"
import { IAbout, ICV } from "./interface/IAbout.interface"


@Injectable()
class AboutDatabaseAccess implements IAbout {
    private readonly logger = new Logger(AboutDatabaseAccess.name)

    path = join(__dirname, '../../../data/about.data.json')
    latestCV: ICV

    constructor() {
        this.init()
    }

    init() {
        const file = fs.readFileSync(this.path, 'utf-8')
        this.latestCV = JSON.parse(file)
    }

    getCV(): ICV {
        return this.latestCV
    }
}
export default AboutDatabaseAccess