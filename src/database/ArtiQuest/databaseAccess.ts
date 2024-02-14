import path, { join } from "path"
import { Article } from "src/interface/Article.interface"
import * as fs from 'fs'
import { HttpStatus, Injectable, Logger } from "@nestjs/common"
import { IArtiQuest } from "./interface/IArtiQuery.interface"
import { Category } from "../../interface/category.interface"
import { randomUUID } from "crypto"
import UserDatabaseAccess from "../User/userDatabaseAccess"
import { EditPayloadDto } from "src/artiQuest/dto/editPayload.dto"
import { range } from '../../utils/range'
import { PDFDocument } from 'pdf-lib'


@Injectable()
class ArtDatabaseAccess implements IArtiQuest {
    private readonly logger = new Logger(ArtDatabaseAccess.name)
    path = join(__dirname, '../../../data/articles.data.json')
    arts: Article[] = []
    categories: Category[] = []

    constructor(private readonly userDatabaseAccess: UserDatabaseAccess) {
        this.initArts()
        this.initCategories()

    }

    initArts() {
        const file = fs.readFileSync(this.path, 'utf-8')
        const artsList = JSON.parse(file)

        for (const a of artsList) {
            this.arts.push(a)
        }
    }

    initCategories() {
        const path = join(__dirname, '../../../data/categories.data.json')

        const file = fs.readFileSync(path, 'utf-8')
        const catsList = JSON.parse(file)

        for (const a of catsList) {
            this.categories.push(a)
        }
    }

    async getAllArticles(): Promise<Article[]> {
        return this.arts
    }

    getArticleById(id: string): Article {
        return this.arts.find(a => a.id.toString() === id.toString())
    }

    getAllCategories(): Category[] {
        return this.categories
    }

    async getArticlesByCategoryId(id: string): Promise<Article[]> {
        return this.arts.filter(a => a.cat.toString() == id.toString())
    }

    getCategoryById(id: string): Category {
        return this.categories.find(c => c.id.toString() === id.toString())
    }

    async create(art: Article): Promise<any> {
        art.id = randomUUID()
        art.created = new Date().toLocaleDateString()
        this.arts.push(art)



        //query will replace it
        // fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {
        //     if (err) {
        //         this.logger.error(
        //             `Something went wrong whild inserting new article: ${err}`,
        //         )
        //     }

        //     else this.logger.log('article inserted successfully')
        // })

        // return art
    }


    async editArticle(id: string, payload: EditPayloadDto): Promise<Article> {
        const { body: editedParagraphs, location } = payload


        const currentArt = this.getArticleById(id)

        const { body } = currentArt
        const paragraphs = body.split(/[\n\r]+/)



        const updatedBody: string[] = paragraphs
        for (let i = 0; i < location.length; i++) {
            const p = paragraphs[location[i]]

            const index = paragraphs.indexOf(p)

            updatedBody[index] = editedParagraphs[i]
        }

        const updatedItem = { ...currentArt, body: updatedBody.join('\n') }

        const newArtsArray = this.arts.map((a: Article) => {
            if (a.id.toString() === id.toString()) return updatedItem

            else return a
        })

        this.arts = newArtsArray

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {

            if (err)
                this.logger.error(`Something went wrong whild editing article body with given id ${id}`)

            else this.logger.log('article updated successfully')
        })

        return updatedItem
    }

    async update(id: string, art: Article): Promise<Article> {
        const artToUpdate = this.arts.find(a => a.id.toString() === id.toString())

        if (!artToUpdate)
            throw Error(`Unable to find art with given id: ${id}`)

        const newArtsArray = this.arts.map((a: Article) => {
            if (a.id.toString() === id.toString()) return art

            else return a
        })

        this.arts = newArtsArray

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {

            if (err)
                this.logger.error(`Something went wrong whild updating article with given id ${art.id}`)

            else this.logger.log('article updated successfully')
        })
        return art
    }

    async remove(id: string): Promise<string> {
        this.arts = this.arts.filter(a => a.id !== id)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {
            if (err)
                this.logger.error(`Error occuer while removing article [${id}]`)


            else this.logger.log('article removed !')
        })

        return id
    }
}
export default ArtDatabaseAccess