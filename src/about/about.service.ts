import { Injectable } from '@nestjs/common'
import AboutDatabaseAccess from 'src/database/About/databaseAccess';

@Injectable()
export class AboutService {

    constructor(private readonly aboutDatabaseAccess: AboutDatabaseAccess) { }

    getCV() {
        return this.aboutDatabaseAccess.getCV()
    }
}