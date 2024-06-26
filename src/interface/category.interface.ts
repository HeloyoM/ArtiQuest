import { Article } from "./Article.interface"

export interface Category {
    id: string
    name: string
    color?: string
    arts?: Article
    len?: number
}