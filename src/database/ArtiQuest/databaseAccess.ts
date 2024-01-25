import { join } from "path"
import { Article } from "src/interface/Article.interface"
import * as fs from 'fs'
import { Injectable } from "@nestjs/common"
import { IArtiQuest } from "./interface/IArtiQuery.interface"
import { Category } from "../../interface/category.interface"
import { randomUUID } from "crypto"

@Injectable()
class ArtDatabaseAccess implements IArtiQuest {
    path = join(__dirname, '../../../data/articles.data.json')
    arts: Article[] = []
    categories: Category[] = []

    constructor() {
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

    getCategoryById(id: string): Category {
        return this.categories.find(c => c.id.toString() === id.toString())
    }

    async create(art: Article): Promise<Article> {
        art.id = randomUUID()
        this.arts.push(art)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {
            if (err)
                throw Error(`Something went wrong whild inserting new article: ${err}`)

            else return 'article inserted successfully'
        })

        return art
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
                throw Error(`Something went wrong whild updating article with given id ${art.id}`)

            else return 'article updated successfully'
        })
        return art
    }

    async remove(id: string): Promise<string> {
        this.arts = this.arts.filter(a => a.id !== id)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {
            if (err)
                throw Error(`Error occuer while removing article [${id}]`)


            else return 'article removed'
        })

        return id
    }
}
export default ArtDatabaseAccess