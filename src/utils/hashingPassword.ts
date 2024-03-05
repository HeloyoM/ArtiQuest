import * as bcrypt from 'bcryptjs'

export async function hashingPassword(password: string) {
    return await bcrypt.hash(password, 12)
}