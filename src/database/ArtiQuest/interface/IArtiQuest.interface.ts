import { Art } from "./Art.interface"

export interface IArtiQuest {
    findAll(): Art[]
    create(art: Art): void
    remove(id: string): void
    update(art: Art): void
}