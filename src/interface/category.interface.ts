import { Article } from "./Article.interface"

export interface Category {
    id: string
    name: string
    arts?: Article
    len?: number
}