export interface Article<T = string> {
    id: string
    title: string
    sub_title: string
    cat: T
}