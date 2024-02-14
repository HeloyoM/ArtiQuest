import { Module } from '@nestjs/common'
import { AboutController } from './about.controller'
import { AboutService } from './about.service'
import AboutDatabaseAccess from 'src/database/About/databaseAccess'

@Module({
    imports: [],
    controllers: [AboutController],
    providers: [AboutService, AboutDatabaseAccess],
})
export class AboutModule { }
