import { GetUserByIdRepository } from "../repositories/index.js"

export class GetUserByIdUseCase {
  async execute(userId) {
    const getUserByIdRepository = new GetUserByIdRepository()

    const user = await getUserByIdRepository.execute(userId)

    return user
  }
}
