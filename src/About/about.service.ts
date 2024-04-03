import { Injectable } from '@nestjs/common'
import AboutDatabaseAccess from '../database/About/databaseAccess';

@Injectable()
export class AboutService {

    constructor(private readonly aboutDatabaseAccess: AboutDatabaseAccess) { }

    getCV() {
        return this.aboutDatabaseAccess.getCV()
    }
}