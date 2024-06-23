import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController,
} from "../../controllers/index.js"
import {
  CreateTransactionRepository,
  GetTransactionsByUserIdRepository,
  GetUserByIdRepository,
  UpdateTransactionRepository,
} from "../../repositories/index.js"
import {
  CreateTransactionUseCase,
  GetTransactionsByUserIdUseCase,
  UpdateTransactionUseCase,
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

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new UpdateTransactionRepository()

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  )

  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  )

  return updateTransactionController
}
