import { v4 as uuidV4 } from "uuid"
import { UserNotFoundError } from "../../errors/user.js"

export class CreateTransactionUseCase {
  constructor(getUserByIdRepository, createTransactionRepository) {
    this.getUserByIdRepository = getUserByIdRepository
    this.createTransactionRepository = createTransactionRepository
  }

  async execute(createTransactionParams) {
    const userId = createTransactionParams.userId

    const user = await this.getUserByIdRepository.execute(userId)

    if (!user) {
      throw new UserNotFoundError(userId)
    }

    const transactionId = uuidV4()

    const transaction = await this.createTransactionRepository.execute({
      ...createTransactionParams,
      id: transactionId,
    })

    return transaction
  }
}
