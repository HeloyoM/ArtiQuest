import { EditPayloadDto } from "../../../artiQuest/dto/editPayload.dto"
import { Article } from "../../../interface/Article.interface"
import { Category } from "../../../interface/category.interface"

export interface IArtiQuest {
    /*Get*/
    getAllArticles(): Promise<Article[]>
    getArticleById(id: string): Article
    getArticlesByCategoryId(id: string): Promise<Article[]>
    getUserCategoryInterest(user_id: string): Promise<void>
    getAllCategories(): Category[]
    getCategoryById(id: string): Category

    /*Post*/
    createCategory(cat: Category): Promise<Category>
    create(art: Article): Promise<Article>

    /*Delete */
    remove(id: string): void

    /*Put*/
    update(id: string, art: Article): Promise<Article>

    /*Patch*/
    editArticle(id: string, payload: EditPayloadDto): Promise<Article>
    toggleArticleActivity(id: string): Promise<string>
    rate(id: string, rate: number, user: any): void
    incViewers(id: string, user: any): void

}