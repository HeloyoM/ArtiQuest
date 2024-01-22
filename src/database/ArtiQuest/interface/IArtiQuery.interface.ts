import { Art } from "./Art.interface"

export interface IArtiQuest {
    findAll(): Promise<Art[]>
    create(art: Art): void
    remove(id: string): void
    update(id: string, art: Art): Promise<Art>
}