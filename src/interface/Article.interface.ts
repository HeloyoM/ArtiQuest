import { Category } from "./category.interface"
import { User } from "./user.interface"

export interface Article<T = string | Category> {
    id: string
    title: string
    sub_title: string
    cat: T
    created: Date | string
    auther: User | string
    body: string
    rank: number
}