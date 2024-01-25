import { Article } from "src/interface/Article.interface"
import { Category } from "src/interface/category.interface"

export interface IArtiQuest {
    getAllArticles(): Promise<Article[]>
    getArticleById(id: string): Article

    getAllCategories(): Category[]
    getCategoryById(id: string): Category

    create(art: Article): Promise<Article>
    remove(id: string): void
    update(id: string, art: Article): Promise<Article>
}