import { Injectable } from '@nestjs/common'
import ArtDatabaseAccess from '../database/ArtiQuest/databaseAccess'
import { Article } from 'src/interface/Article.interface'
import { Category } from 'src/interface/category.interface'

@Injectable()
export class ArtiQuestService {

    constructor(private readonly artDatabaseAccess: ArtDatabaseAccess) { }

    async getAllArticles(): Promise<Article<Category>[]> {
        return await this.artDatabaseAccess.getAllArticles()
    }

    getArticleById(id: string) {
        return this.artDatabaseAccess.getOneArticle(id)
    }

    getAllCategories() {
        return this.artDatabaseAccess.getCategories()
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