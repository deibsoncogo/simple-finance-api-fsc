export class GetUserByIdUseCase {
  constructor(getUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(userId) {
    const getUser = await this.getUserByIdRepository.execute(userId)

    return getUser
  }
}
