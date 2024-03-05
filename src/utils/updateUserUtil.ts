import { UpdateUserDto } from "src/Auth/dto/UpdateUser.dto"
import { User } from "src/interface/user.interface"
import { hashingPassword } from "./hashingPassword"


export async function updateUserFields(user: User, updatedFields: UpdateUserDto) {
    for (let key in updatedFields) {
        if (updatedFields[key] !== "") {
            if (key === 'password') user[key] = await hashingPassword(updatedFields.password)

            else user[key] = updatedFields[key]
        }
    }
    return user
}