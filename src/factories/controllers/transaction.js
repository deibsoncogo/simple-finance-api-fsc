import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
} from "../../controllers/index.js"
import {
  CreateTransactionRepository,
  GetTransactionsByUserIdRepository,
  GetUserByIdRepository,
} from "../../repositories/index.js"
import {
  CreateTransactionUseCase,
  GetTransactionsByUserIdUseCase,
} from "../../useCases/index.js"

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

export const makeGetTransactionsByUserIdController = () => {
  const getTransactionsByUserIdRepository =
    new GetTransactionsByUserIdRepository()

  const getUserByIdRepository = new GetUserByIdRepository()

  const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
    getUserByIdRepository,
    getTransactionsByUserIdRepository,
  )

  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)

  return getTransactionsByUserIdController
}
