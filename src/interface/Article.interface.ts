import { IArticleRank } from "./IArticleRank.interface"
import { RawDraftContentState } from "./RawDraftContentState.interface"
import { Category } from "./category.interface"
import { User } from "./user.interface"

export interface Article<T = string | Category> {
    id: string
    title: string
    sub_title: string
    cat: T
    createdAt: Date | string
    author: Partial<User> | string
    body: RawDraftContentState
    rank: IArticleRank
    viewers: string[]
    active: boolean
}