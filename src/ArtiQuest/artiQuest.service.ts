import { Injectable } from '@nestjs/common'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import { Article } from 'src/interface/Article.interface'
import { Category } from 'src/interface/category.interface'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'
import { EditPayloadDto } from './dto/editPayload.dto'
import { IRate } from 'src/database/ArtiQuest/interface/IRate.interface'
import { User } from 'src/interface/user.interface'

@Injectable()
export class ArtiQuestService {
    constructor(
        private readonly artDatabaseAccess: ArtDatabaseAccess,
        private readonly userDatabaseAccess: UserDatabaseAccess
    ) { }

    async getAllArticles(): Promise<Article[]> {
        const articles = await this.artDatabaseAccess.getAllArticles()

        const articlesAssignedCategories = this.assignCategories(articles)

        const articlesAssignedAuthors = await this.assignAuthors(articlesAssignedCategories)

        const articlesAssignedRates = await this.assignRates(articlesAssignedAuthors)

        return articlesAssignedRates
    }

    assignCategories(articles: Article[]): Article<Category>[] {
        const categories = this.artDatabaseAccess.getAllCategories()

        let categoriesMap = new Map(categories.map(category => [category.id, category]))

        const articlesArr: Article<Category>[] = []
        articles.forEach((art: Article) => {
            let categoryId = art.cat as string

            if (categoriesMap.has(categoryId)) {
                articlesArr.push({ ...art, cat: categoriesMap.get(categoryId) })
            }
        })

        return articlesArr
    }

    async assignAuthors(articles: Article[]): Promise<Article[]> {
        const users = await this.userDatabaseAccess.findAll()

        let authorsMap = new Map(users.map(user => [user.id, user]))

        const articlesArr: Article[] = []

        articles.forEach((art: Article) => {
            let authorId = art.author as string

            if (authorsMap.has(authorId)) {
                const { password, ...result } = authorsMap.get(authorId)
                articlesArr.push({ ...art, author: result })
            }
        })

        return articlesArr
    }

    async assignRates(articles: Article[]) {
        const rates = this.artDatabaseAccess.getRates()

        const articlesArr: Article[] = []

        for (const a of articles) {
            const artRates = rates.filter(r => r.id === a.id)

            if (!artRates) return

            else {
                a.rank = this.rateCalc(artRates)

                articlesArr.push(a)
            }
        }

        return articlesArr
    }

    rateCalc(rates: IRate[]) {
        let sum = 0
        let voters: string[] = []
        for (let i = 0; i < rates.length; i++) {
            sum += rates[i].rate
            voters.push(rates[i].user_id)
        }
        const rank = sum ? (Math.round(sum / rates.length)) : sum

        return { total: rank, voters }
    }

    async getArticleRank(id: string) {
        const rates = this.artDatabaseAccess.getRates().filter(r => r.id === id)

        return this.rateCalc(rates)
    }

    async getArticlesByCategoryId(id: string) {
        const articlesWithCat = await this.getAllArticles()
        let byCatId = articlesWithCat.filter((a: Article<Category>) => a.cat.id.toString() === id.toString())

        if (!byCatId.length) {
            articlesWithCat.map(a => console.log(a.author))
            byCatId = articlesWithCat.filter((a: Article<Category>) => {
                const authorObj = a.author as User

                return authorObj.id.toString() === id.toString()
            })
        }

        return byCatId
    }


    async getArticleById(id: string): Promise<Article> {
        const catefories = this.artDatabaseAccess.getAllCategories()

        const art = this.artDatabaseAccess.getArticleById(id)

        const articleCategory: Category = catefories.find(c => c.id.toString() === art.cat.toString())

        art.cat = articleCategory

        const [articlesAssignedAuthors] = await this.assignAuthors([art])

        const [articleAssignRates] = await this.assignRates([articlesAssignedAuthors])

        return articleAssignRates
    }


    async getAllCategories() {
        const catefories = this.artDatabaseAccess.getAllCategories()

        const arts = await this.artDatabaseAccess.getAllArticles()

        const articlesAssignedAuthors = await this.assignAuthors(arts)

        const articlesAssignedRates = await this.assignRates(articlesAssignedAuthors)

        const categoriesList = catefories.map((cat: Category) => {
            const catArticles = articlesAssignedRates.filter(a => a.cat.toString() === cat.id.toString())

            return { ...cat, arts: catArticles, len: catArticles.length }
        })

        return categoriesList
    }

    getCategoryById(id: string) {
        return this.artDatabaseAccess.getCategoryById(id)
    }

    async createCategory(cat) {
        return this.artDatabaseAccess.createCategory(cat)
    }

    async createArt(art: Article): Promise<void> {
        await this.artDatabaseAccess.create(art)
    }

    async editArticle(id: string, payload: EditPayloadDto) {
        return await this.artDatabaseAccess.editArticle(id, payload)
    }

    async toggleArticleActivity(id: string) {
        return await this.artDatabaseAccess.toggleArticleActivity(id)
    }

    async rate(id: string, rate: number, user: any) {
        try {
            await this.artDatabaseAccess.rate(id, rate, user)

            return this.getArticleRank(id)
        } catch (error) {
            throw Error('unable to rate article')
        }
    }

    async incArtViewers(id: string, user: any) {
        try {
            await this.artDatabaseAccess.incViewers(id, user)
        } catch (error) {
            throw Error('unable to rate article')
        }
    }

    async getUserCategoryInterest(user_id: string) {
        return this.artDatabaseAccess.getUserCategoryInterest(user_id)
    }
    async updateArt(id: string, art: Article): Promise<Article> {
        return await this.artDatabaseAccess.update(id, art)
    }

    async remove(id: string): Promise<string> {
        return await this.artDatabaseAccess.remove(id)
    }
}