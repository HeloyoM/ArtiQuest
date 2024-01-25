import { Injectable } from '@nestjs/common'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import { Article } from 'src/interface/Article.interface'
import { Category } from 'src/interface/category.interface'

@Injectable()
export class ArtiQuestService {

    constructor(private readonly artDatabaseAccess: ArtDatabaseAccess) { }

    async getAllArticles(): Promise<Article<Category>[]> {
        const articles = await this.artDatabaseAccess.getAllArticles()
        const categories = this.artDatabaseAccess.getAllCategories()

        let categoriesMap = new Map(categories.map(category => [category.id, category]))

        const articlesArr: Article<Category>[] = []

        articles.forEach((art: Article) => {
            let categoryId = art.cat

            if (categoriesMap.has(categoryId)) {
                articlesArr.push({ ...art, cat: categoriesMap.get(categoryId) })
            }
        })

        return articlesArr
    }

    getArticleById(id: string) {
        return this.artDatabaseAccess.getArticleById(id)
    }

    async getAllCategories() {
        const catefories = this.artDatabaseAccess.getAllCategories()

        const arts = await this.artDatabaseAccess.getAllArticles()

        const categoriesList = catefories.map((cat: Category) => {
            const len = arts.filter(a => a.cat.toString() === cat.id.toString()).length

            return { ...cat, len }
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