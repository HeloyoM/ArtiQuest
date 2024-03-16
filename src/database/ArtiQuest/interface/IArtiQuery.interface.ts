import { EditPayloadDto } from "src/artiQuest/dto/editPayload.dto"
import { Article } from "src/interface/Article.interface"
import { Category } from "src/interface/category.interface"

export interface IArtiQuest {
    getAllArticles(): Promise<Article[]>
    getArticleById(id: string): Article
    getArticlesByCategoryId(id: string): Promise<Article[]>
    getUserCategoryInterest(user_id: string): Promise<void>
    getAllCategories(): Category[]
    getCategoryById(id: string): Category

    createCategory(cat: any): Promise<any>

    create(art: Article): Promise<Article>

    remove(id: string): void

    update(id: string, art: Article): Promise<Article>

    editArticle(id: string, payload: EditPayloadDto): Promise<Article>
    rate(id: string, rate: number, user: any): void
    incViewers(id: string, user: any): void
}