import { join } from "path"
import * as fs from 'fs'
import { Injectable, Logger } from "@nestjs/common"
import { IPostQuery } from "./interface/IPostQuery.interface"



@Injectable()
class PostDatabaseAccess implements IPostQuery {
    private readonly logger = new Logger(PostDatabaseAccess.name)

    constructor() {
    }
}
export default PostDatabaseAccess