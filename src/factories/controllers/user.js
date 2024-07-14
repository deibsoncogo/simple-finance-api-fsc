import { PasswordHashAdapter } from "../../adapters/index.js"
import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  UpdateUserController,
} from "../../controllers/index.js"
import {
  CreateUserRepository,
  DeleteUserRepository,
  GetUserBalanceRepository,
  GetUserByEmailRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from "../../repositories/index.js"
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserBalanceUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "../../useCases/index.js"

export const makeCreateUserController = () => {
  const createUserRepository = new CreateUserRepository()

  const getUserByEmailRepository = new GetUserByEmailRepository()

  const passwordHashAdapter = new PasswordHashAdapter()

  const createUserUseCase = new CreateUserUseCase(
    passwordHashAdapter,
    getUserByEmailRepository,
    createUserRepository,
  )

  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}

export const makeGetUserByIdController = () => {
  const getUserByIdRepository = new GetUserByIdRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}

export const makeGetUserBalanceController = () => {
  const getUserBalanceRepository = new GetUserBalanceRepository()

  const getUserByIdRepository = new GetUserByIdRepository()

  const getUserBalanceUseCase = new GetUserBalanceUseCase(
    getUserByIdRepository,
    getUserBalanceRepository,
  )

  const getUserBalanceController = new GetUserBalanceController(
    getUserBalanceUseCase,
  )

  return getUserBalanceController
}

export const makeUpdateUserController = () => {
  const updateUserRepository = new UpdateUserRepository()

  const getUserByEmailRepository = new GetUserByEmailRepository()

  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository,
  )

  const updateUserController = new UpdateUserController(updateUserUseCase)

  return updateUserController
}

export const makeDeleteUserController = () => {
  const deleteUserRepository = new DeleteUserRepository()

  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  return deleteUserController
}
