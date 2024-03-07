import * as bcrypt from 'bcryptjs'

export async function hashingPassword(password: string) {
    return await bcrypt.hash(password, 12)
}

export async function comparingPasswords(newpass: string, oldpass: string) {
    return await bcrypt.compare(newpass, oldpass)
}