import { Module } from '@nestjs/common'
import { AboutController } from './about.controller'
import { AboutService } from './about.service'
import AboutDatabaseAccess from '../database/About/databaseAccess'

@Module({
    imports: [],
    controllers: [AboutController],
    providers: [AboutService, AboutDatabaseAccess],
})
export class AboutModule { }
