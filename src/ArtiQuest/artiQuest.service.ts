import { Injectable } from '@nestjs/common'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import { Article } from 'src/interface/Article.interface'
import { Category } from 'src/interface/category.interface'
import UserDatabaseAccess from 'src/database/User/userDatabaseAccess'

@Injectable()
export class ArtiQuestService {

    constructor(
        private readonly artDatabaseAccess: ArtDatabaseAccess,
        private readonly userDatabaseAccess: UserDatabaseAccess

    ) { }

    async getAllArticles(): Promise<Article<Category>[]> {
        const articles = await this.artDatabaseAccess.getAllArticles()

        const articlesAssignedCategories = await this.assignCategories(articles)

        const articlesAssignedAuthers = await this.assignAuthers(articlesAssignedCategories)

        console.log(articlesAssignedAuthers)
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

    async assignAuthers(articles: Article<Category>[]): Promise<Article<Category>[]> {
        const users = await this.userDatabaseAccess.findAll()

        let authersMap = new Map(users.map(user => [user.id, user]))

        const articlesArr: Article<Category>[] = []

        articles.forEach((art: Article) => {
            let autherId = art.auther as string

            if (authersMap.has(autherId)) {
                articlesArr.push({ ...art, cat: art.cat as Category, auther: authersMap.get(autherId) })
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
        console.log(art)
        return art
    }

    async getAllCategories() {
        const catefories = this.artDatabaseAccess.getAllCategories()

        const arts = await this.artDatabaseAccess.getAllArticles()

        const categoriesList = catefories.map((cat: Category) => {
            const catArticles = arts.filter(a => a.cat.toString() === cat.id.toString())

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

    async updateArt(id: string, art: Article): Promise<Article> {
        return await this.artDatabaseAccess.update(id, art)
    }

    async remove(id: string): Promise<string> {
        return await this.artDatabaseAccess.remove(id)
    }
}