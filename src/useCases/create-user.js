import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import { EmailAlreadyInUseError } from "../errors/user.js"
import { CreateUserRepository } from "../repositories/create-user.js"
import { GetUserByEmailRepository } from "../repositories/get-user-by-email.js"

export class CreateUserUseCase {
  async execute(createUserParams) {
    const getUserByEmailRepository = new GetUserByEmailRepository()

    const userWithProvidedEmail = await getUserByEmailRepository.execute(
      createUserParams.email,
    )

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const userId = uuidV4()

    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    const createUserRepository = new CreateUserRepository()

    const createdUser = await createUserRepository.execute(user)

    return createdUser
  }
}
