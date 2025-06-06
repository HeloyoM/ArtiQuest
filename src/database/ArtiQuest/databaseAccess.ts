import { Injectable, Logger } from "@nestjs/common"
import { randomUUID } from "crypto"
import { join } from "path"
import * as fs from 'fs'

import { Article } from "../../interface/Article.interface"
import { IArtiQuest } from "./interface/IArtiQuery.interface"
import { Category } from "../../interface/category.interface"
import UserDatabaseAccess from "../User/userDatabaseAccess"
import { IRate } from "./interface/IRate.interface"
import { ChangeCatergoryNameDto } from "src/artiQuest/dto/ChangeCategoryName.dto"

@Injectable()
class ArtDatabaseAccess implements IArtiQuest {
    private readonly logger = new Logger(ArtDatabaseAccess.name)
    path = join(__dirname, '../../../data/articles.data.json')
    ratePath = join(__dirname, '../../../data/rates.data.json')
    categoriesPath = join(__dirname, '../../../data/categories.data.json')
    arts: Article[] = []
    categories: Category[] = []
    rates: IRate[] = []

    constructor(private readonly userDatabaseAccess: UserDatabaseAccess) {
        this.initArts()
        this.initCategories()
        this.initRates()
    }

    getRates() {
        return this.rates
    }

    async getAllArticles(): Promise<Article[]> {
        if (!this.arts.length)
            this.initRates()

        return this.arts
    }

    initArts() {
        const file = fs.readFileSync(this.path, 'utf-8')
        const artsList = JSON.parse(file)

        for (const a of artsList) {
            this.arts.push(a)
        }
    }

    initCategories() {
        const file = fs.readFileSync(this.categoriesPath, 'utf-8')
        const catsList = JSON.parse(file)

        for (const a of catsList) {
            this.categories.push(a)
        }
    }

    initRates() {
        const path = join(__dirname, '../../../data/rates.data.json')

        const file = fs.readFileSync(path, 'utf-8')
        const ratesList = JSON.parse(file)

        for (const a of ratesList) {
            this.rates.push(a)
        }
    }

    getArticleById(id: string): Article {
        const art = this.arts.find((a: Article) => a.id.toString() === id.toString())

        if (!art)
            throw Error(`Not found article with given id ${id}`)

        return art
    }

    getAllCategories(): Category[] {
        if (!this.categories.length)
            this.initCategories()

        return this.categories
    }

    async getArticlesByCategoryId(id: string): Promise<Article[]> {
        const arts = this.arts.filter(a => a.cat.toString() == id.toString())

        return arts
    }

    getCategoryById(id: string): Category {
        return this.categories.find(c => c.id.toString() === id.toString())
    }

    async createCategory(cat: Category): Promise<Category> {
        cat.id = randomUUID()

        this.categories.push(cat)

        try {
            fs.writeFile(this.categoriesPath, JSON.stringify(this.categories), 'utf-8', (err) => {
                if (err) {
                    this.logger.error(
                        `Something went wrong whild inserting new article: ${err}`,
                    )
                }

                else this.logger.log('article inserted successfully')
            })
        } catch (error) {
            throw Error('Unalbe to create new category')
        }

        return cat
    }

    async changeCategoryName(payload: ChangeCatergoryNameDto): Promise<string> {
        const categoryToUpdate = this.categories.find(cat => cat.id.toString() === payload.id.toString())

        const category = {
            name: payload.name,
            id: payload.id,
            color: categoryToUpdate.color
        }
        if (!categoryToUpdate)
            throw Error(`Unable to find category with given id: ${payload.id}`)

        const newCategoriesArray = this.categories.map((cat: Category) => {
            if (cat.id.toString() === payload.id.toString()) return category

            else return cat
        })

        this.categories = newCategoriesArray

        try {
            fs.writeFile(this.categoriesPath, JSON.stringify(this.categories), 'utf-8', (err) => {
                if (err) {
                    this.logger.error(
                        `Something went wrong whild inserting new article: ${err}`,
                    )
                }

                else this.logger.log('article inserted successfully')
            })

            return payload.name
        } catch (error) {

        }
    }
    async create(art: Article): Promise<any> {
        this.arts.push(art)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {
            if (err) {
                this.logger.error(
                    `Something went wrong whild inserting new article: ${err}`,
                )
            }

            else this.logger.log('article inserted successfully')
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
                this.logger.error(`Something went wrong whild updating article with given id ${art.id}`)

            else this.logger.log('article updated successfully')
        })
        return art
    }

    // async editArticle(id: string, payload: EditPayloadDto): Promise<any/*Article*/> {

    //     try {
    //         const { body: editedParagraphs, location } = payload


    //         const currentArt = this.getArticleById(id)

    //         const { body } = currentArt
    //         const paragraphs = body//.split(/[\n\r]+/)

    //         const updatedBody: string[] = paragraphs
    //         for (let i = 0; i < location.length; i++) {
    //             const p = paragraphs[location[i]]

    //             const index = paragraphs.indexOf(p)

    //             updatedBody[index] = editedParagraphs[i]
    //         }

    //         const updatedItem = { ...currentArt, body: updatedBody.join('\n') }

    //         const newArtsArray = this.arts.map((a: Article) => {
    //             if (a.id.toString() === id.toString()) return updatedItem

    //             else return a
    //         })

    //         //this.arts = newArtsArray

    //         //query will replace it
    //         fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {

    //             if (err)
    //                 this.logger.error(`Something went wrong whild editing article body with given id ${id}`)

    //             else this.logger.log('article updated successfully')
    //         })

    //         return updatedItem
    //     } catch (error) {

    //     }
    // }

    async toggleArticleActivity(id: string) {
        try {
            const newArtsArray = this.arts.map((a: Article) => {
                if (a.id.toString() === id.toString()) return { ...a, active: !a.active }

                else return a
            })

            this.arts = newArtsArray

            //query will replace it
            fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {

                if (err)
                    this.logger.error(`Unalbe to toggle activity of article id [${id}], with given error: [${err}]`)

                else this.logger.log('article updated successfully')
            })

            return id
        } catch (error) {
            throw Error('Unalbe to toggle activity of article')
        }
    }

    async rate(id: string, rate: number, user: any): Promise<void> {
        const rank: IRate = {
            user_id: user.userId,
            id,
            rate
        }

        this.rates.push(rank)

        try {
            fs.writeFile(this.ratePath, JSON.stringify(this.rates), 'utf-8', (err) => {

                if (err)
                    this.logger.error(`cannot update rating to article with given id [${id}]`)

                else this.logger.log('article rated successfully')
            })
        } catch (error) {
            throw Error('unable to score article')
        }
    }

    incViewers(id: string, user: any): void {
        const art = this.arts.find(a => a.id.toString() === id.toString())

        if (!art)
            throw Error(`Unable to find art with given id: ${id}`)

        const newArtsArray = this.arts.map((a: Article) => {
            if (a.id.toString() === id.toString()) return { ...art, viewers: [user.userId, ...art.viewers] }

            else return a
        })

        this.arts = newArtsArray

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {

            if (err)
                this.logger.error(`Something went wrong whild updating article with given id ${art.id}`)

            else this.logger.log(`article viewed by user with given id [${user.userId}]`)
        })
    }

    async getUserCategoryInterest(user_id: string): Promise<any> {
        const articlesReadByUser = this.arts.filter(a => a.viewers.includes(user_id.toString()))

        articlesReadByUser.map(a => a.cat)

        const array = this.getAllCategories().map(c => c.id)

        let frequencyMap = {}
        let maxFrequency = 0
        let mostFrequentCategory = null

        for (let i = 0; i < array.length; i++) {
            let currentCategory = array[i]
            if (frequencyMap[currentCategory] === undefined) {
                frequencyMap[currentCategory] = 1
            } else {
                frequencyMap[currentCategory]++
            }

            if (frequencyMap[currentCategory] > maxFrequency) {
                maxFrequency = frequencyMap[currentCategory]
                mostFrequentCategory = currentCategory
            }
        }

        return mostFrequentCategory
    }

    async remove(id: string): Promise<string> {
        this.arts = this.arts.filter(a => a.id !== id)

        //query will replace it
        fs.writeFile(this.path, JSON.stringify(this.arts), 'utf-8', (err) => {
            if (err)
                this.logger.error(`Error occuer while removing article [${id}]`)


            else this.logger.log('article removed seccussfuly!')
        })

        return id
    }
}

export default ArtDatabaseAccess