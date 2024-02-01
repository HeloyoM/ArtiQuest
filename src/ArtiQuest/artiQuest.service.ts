import { Injectable } from '@nestjs/common'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import { Article } from 'src/interface/Article.interface'
import { Category } from 'src/interface/category.interface'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'
import { EditPayloadDto } from './dto/editPayload.dto'

@Injectable()
export class ArtiQuestService {

    constructor(
        private readonly artDatabaseAccess: ArtDatabaseAccess,
        private readonly userDatabaseAccess: UserDatabaseAccess

    ) { }

    async getAllArticles(): Promise<Article[]> {
        const articles = await this.artDatabaseAccess.getAllArticles()

        const articlesAssignedCategories = this.assignCategories(articles)

        const articlesAssignedAuthers = await this.assignAuthers(articlesAssignedCategories)

        return articlesAssignedAuthers
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

    async assignAuthers(articles: Article[]): Promise<Article[]> {
        const users = await this.userDatabaseAccess.findAll()

        let authersMap = new Map(users.map(user => [user.id, user]))

        const articlesArr: Article[] = []

        articles.forEach((art: Article) => {
            let autherId = art.auther as string
            let category
            if (typeof art.cat == 'string') {
                category = art.cat as string
            } else {
                category = art.cat as Category
            }

            if (authersMap.has(autherId)) {
                articlesArr.push({ ...art, cat: category, auther: authersMap.get(autherId) })
            }
        })

        return articlesArr
    }


    async getArticlesByCategoryId(id: string) {
        const articlesWithCat = await this.getAllArticles()
        const byCatId = articlesWithCat.filter((a: Article<Category>) => a.cat.id.toString() === id.toString())

        return byCatId
    }



    async getArticleById(id: string): Promise<Article> {
        const catefories = this.artDatabaseAccess.getAllCategories()

        const art = this.artDatabaseAccess.getArticleById(id)

        const articleCategory: Category = catefories.find(c => c.id.toString() === art.cat.toString())

        art.cat = articleCategory

        const [articlesAssignedAuthers] = await this.assignAuthers([art])

        return articlesAssignedAuthers
    }



    async getAllCategories() {
        const catefories = this.artDatabaseAccess.getAllCategories()

        const arts = await this.artDatabaseAccess.getAllArticles()

        const articlesAssignedAuthers = await this.assignAuthers(arts)


        const categoriesList = catefories.map((cat: Category) => {
            const catArticles = articlesAssignedAuthers.filter(a => a.cat.toString() === cat.id.toString())

            return { ...cat, arts: catArticles, len: catArticles.length }
        })

        return categoriesList
    }

    getCategoryById(id: string) {
        return this.artDatabaseAccess.getCategoryById(id)
    }

    async createArt(art: Article): Promise<void> {
        await this.artDatabaseAccess.create(art)
    }

    async editArticle(id: string, payload: EditPayloadDto) {
       return  await this.artDatabaseAccess.editArticle(id, payload)
    }

    async updateArt(id: string, art: Article): Promise<Article> {
        return await this.artDatabaseAccess.update(id, art)
    }

    async remove(id: string): Promise<string> {
        return await this.artDatabaseAccess.remove(id)
    }
}