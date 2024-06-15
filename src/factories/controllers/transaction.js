import { CreateTransactionController } from "../../controllers/index.js"
import { CreateTransactionRepository } from "../../repositories/transaction/create-transaction.js"
import { GetUserByIdRepository } from "../../repositories/user/get-user-by-id.js"
import { CreateTransactionUseCase } from "../../useCases/index.js"

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new CreateTransactionRepository()

  const getUserByIdRepository = new GetUserByIdRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    getUserByIdRepository,
    createTransactionRepository,
  )

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  )

  return createTransactionController
}
