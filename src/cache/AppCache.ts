import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Inject, Injectable } from "@nestjs/common"
import { Cache } from 'cache-manager'
import CacheKeys from "src/utils/CacheKeys"
import IInprogress from "./dto/IInprogressArt.dto"

@Injectable()
class AppCache {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    async getKeys() {
        return await this.cacheManager.store.keys()
    }

    public get getInprogressList(): Promise<IInprogress[]> {
        return this.getInprogressArticles()
    }

    async getInprogressArticles(): Promise<IInprogress[]> {
        const keys = await this.getKeys()
        const storedInprogressArticles = []

        for (const key of keys) {
            const splittedKey = key.split('-')
            const inprogressKey = splittedKey.slice(0, 2).join('-')

            if (inprogressKey === CacheKeys.IN_PROGRESS) {
                const ttl = await this.cacheManager.store.ttl(key)
                const art: any = await this.cacheManager.get(key)
                art.ttl = ttl

                storedInprogressArticles.push(art)
            }
        }

        return storedInprogressArticles
    }

    async getCachedItemByKey(key: string) {
        return await this.cacheManager.get(key)
    }

    async getInprogressArtsByAuthorId(authorId: string) {
        const allInprogressArts = await this.getInprogressList

        const filteredData = allInprogressArts.filter((item: IInprogress) => {
            if (typeof item.author !== 'string')
                return item.author.id === authorId
        })

        return filteredData
    }

    async removeFromCache(author_id: string, id: string) {
        const key = `${CacheKeys.IN_PROGRESS}-${author_id}-${id}`

        await this.cacheManager.del(key)
    }

    async updateCacheTtl(author_id: string, id: string, ttlUnit: number) {
        const key = `${CacheKeys.IN_PROGRESS}-${author_id}-${id}`

        const art = await this.getCachedItemByKey(key)

        const ttl = await this.cacheManager.store.ttl(key)

        const newTtl = ttl + ttlUnit

        console.log({ ttl, ttlUnit, newTtl })
        try {
            await this.cacheManager.set(`${CacheKeys.IN_PROGRESS}-${author_id}-${id}`, art, newTtl)
        } catch (error) {

        }
    }

}

export default AppCache