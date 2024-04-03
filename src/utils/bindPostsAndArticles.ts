import { Article } from "../interface/Article.interface"
import { IPost } from "../interface/Post.interface"

export default function bindPostsAndArticles(articles: Article[], posts: IPost[]) {
    const articlesWithPosts = []

    articles.forEach(article => {
        const relatedPosts = posts.filter(post => post.art_id === article.id)

        if (relatedPosts.length) {
            articlesWithPosts.push({ ...article, posts: relatedPosts })
        }
    })

    return articlesWithPosts
}