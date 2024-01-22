import { join } from "path"
import { Art } from "./interface/Art.interface"
import * as fs from 'fs'
import { Injectable } from "@nestjs/common"

@Injectable()
class ArtDatabaseAccess {
    arts: Art[] = []

    constructor() {
        this.init()
    }

    init() {
        const path = join(__dirname, '../../../data/articles.json')

        const file = fs.readFileSync(path, 'utf-8')
        const artsList = JSON.parse(file).articles

        for (const a of artsList) {
            this.arts.push(a)
        }
    }

    async findAll(): Promise<Art[]> {
        return this.arts
    }

    async create(art: Art): Promise<void> {
        this.arts.push(art)
    }

    async update(id: string, art: Art): Promise<Art> {
        const artToUpdate = this.arts.find(a => a.id.toString() === id.toString())

        if (!artToUpdate)
            throw Error(`Unable to find art with given id: ${id}`)

        const artIndex = this.arts.findIndex(a => a.id == id)

        this.arts = [art, ...this.arts.slice(artIndex + 1, this.arts.length)]

        return art
    }

    async remove(id: string): Promise<string> {
        this.arts = this.arts.filter(a => a.id !== id)

        return id
    }
}
export default ArtDatabaseAccess