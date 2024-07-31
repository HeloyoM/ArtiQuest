import { Inject, Injectable, forwardRef } from '@nestjs/common'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import { Article } from '../interface/Article.interface'
import { Category } from '../interface/category.interface'
import UserDatabaseAccess from '../database/User/userDatabaseAccess'
import { EditPayloadDto } from './dto/editPayload.dto'
import { IRate } from '../database/ArtiQuest/interface/IRate.interface'
import { User } from '../interface/user.interface'
import { MailService } from 'src/email/email.service'
import { EmailMsg } from 'src/email/enum/EmailMsg.enum'

@Injectable()
export class ArtiQuestService {
    constructor(
        @Inject(forwardRef(() => MailService))
        private mailService: MailService,
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

    async createCategory(cat: Category) {
        try {
            return this.artDatabaseAccess.createCategory(cat)
        } catch (error) {
            throw Error('Unalbe to create new category')
        }
    }

    async createArt(art: Article): Promise<void> {
        await this.artDatabaseAccess.create(art)
    }

    async editArticle(id: string, payload: EditPayloadDto) {
        //return await this.artDatabaseAccess.editArticle(id, payload)
    }

    async toggleArticleActivity(id: string) {
        try {
            const art_id = await this.artDatabaseAccess.toggleArticleActivity(id)

            //this.mailService.updateAuthorAboutArticle(id, EmailMsg.ACTIVATION)

            return art_id
        } catch (error) {
            throw Error('Unalbe to toggle activity of article')
        }
    }

    async rate(id: string, rate: number, user: any) {
        try {
            await this.artDatabaseAccess.rate(id, rate, user)

            return this.getArticleRank(id)
        } catch (error) {
            throw Error('unable to score article')
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