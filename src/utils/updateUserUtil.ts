import { UpdateUserDto } from "src/Auth/dto/UpdateUser.dto"
import { User } from "src/interface/user.interface"
import { comparingPasswords, hashingPassword } from "./hashingPassword"


export async function updateUserFields(user: User, updatedFields: UpdateUserDto) {
    for (let key in updatedFields) {
        if (updatedFields[key] !== "") {
            if (key === 'password') {
                
                if (await comparingPasswords(updatedFields.password, user[key])) {
                    return false
                }

                else user[key] = await hashingPassword(updatedFields.password)
            }

            else user[key] = updatedFields[key]
        }
    }
    return user
}