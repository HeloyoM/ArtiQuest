import { Injectable } from '@nestjs/common'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import { Art } from 'src/database/ArtiQuest/interface/Art.interface'

@Injectable()
export class ArtiQuestService {

    constructor(private readonly artDatabaseAccess: ArtDatabaseAccess) { }

    async findAll(): Promise<Art[]> {
        return await this.artDatabaseAccess.findAll()
    }

    async createArt(art: Art): Promise<void> {
        await this.artDatabaseAccess.create(art)
    }

    async updateArt(id: string, art: Art): Promise<Art> {
        return await this.artDatabaseAccess.update(id, art)
    }

    async remove(id: string): Promise<string> {
        return await this.artDatabaseAccess.remove(id)
    }


}