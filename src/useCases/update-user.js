import bcrypt from "bcrypt"
import { EmailAlreadyInUseError } from "../errors/user.js"
import {
  GetUserByEmailRepository,
  UpdateUserRepository,
} from "../repositories/index.js"

export class UpdateUserUseCase {
  async execute(userId, updateUserParams) {
    const user = { ...updateUserParams }

    if (updateUserParams.email) {
      const getUserByEmailRepository = new GetUserByEmailRepository()

      const userWithProvidedEmail = await getUserByEmailRepository.execute(
        updateUserParams.email,
      )

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)
      user.password = hashedPassword
    }

    const updateUserRepository = new UpdateUserRepository()

    const updateUser = await updateUserRepository.execute(userId, user)

    return updateUser
  }
}
