import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"
import { CreateUserRepository } from "../repositories/create-user.js"

export class CreateUserUseCase {
  async execute(createUserParams) {
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
