import { IdGeneratorAdapter } from "../../adapters/index.js"
import {
  CreateTransactionController,
  DeleteTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController,
} from "../../controllers/index.js"
import {
  CreateTransactionRepository,
  DeleteTransactionRepository,
  GetTransactionsByUserIdRepository,
  GetUserByIdRepository,
  UpdateTransactionRepository,
} from "../../repositories/index.js"
import {
  CreateTransactionUseCase,
  DeleteTransactionUseCase,
  GetTransactionsByUserIdUseCase,
  UpdateTransactionUseCase,
} from "../../useCases/index.js"

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new CreateTransactionRepository()

  const getUserByIdRepository = new GetUserByIdRepository()

  const idGeneratorAdapter = new IdGeneratorAdapter()

  const createTransactionUseCase = new CreateTransactionUseCase(
    idGeneratorAdapter,
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

export const makeDeleteTransactionController = () => {
  const deleteTransactionRepository = new DeleteTransactionRepository()

  const deleteTransactionUseCase = new DeleteTransactionUseCase(
    deleteTransactionRepository,
  )

  const deleteTransactionController = new DeleteTransactionController(
    deleteTransactionUseCase,
  )

  return deleteTransactionController
}
