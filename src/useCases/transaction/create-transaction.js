import { UserNotFoundError } from "../../errors/user.js"

export class CreateTransactionUseCase {
  constructor(
    idGeneratorAdapter,
    getUserByIdRepository,
    createTransactionRepository,
  ) {
    this.idGeneratorAdapter = idGeneratorAdapter
    this.getUserByIdRepository = getUserByIdRepository
    this.createTransactionRepository = createTransactionRepository
  }

  async execute(createTransactionParams) {
    const userId = createTransactionParams.userId

    const user = await this.getUserByIdRepository.execute(userId)

    if (!user) {
      throw new UserNotFoundError(userId)
    }

    const transactionId = await this.idGeneratorAdapter.execute()

    const transaction = await this.createTransactionRepository.execute({
      ...createTransactionParams,
      id: transactionId,
    })

    return transaction
  }
}
