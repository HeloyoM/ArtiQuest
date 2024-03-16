import { IArticleRank } from "./IArticleRank.interface"
import { Category } from "./category.interface"
import { User } from "./user.interface"

export interface Article<T = string | Category> {
    id: string
    title: string
    sub_title: string
    cat: T
    created: Date | string
    author: Partial<User> | string
    body: string
    rank: IArticleRank
    viewers: string[]
    active: boolean
    // views: number
}