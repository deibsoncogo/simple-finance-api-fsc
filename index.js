import "dotenv/config.js"
import express from "express"
import {
  CreateUserController,
  DeleteUserController,
  GetUserByIdController,
  UpdateUserController,
} from "./src/controllers/index.js"
import {
  CreateUserRepository,
  DeleteUserRepository,
  GetUserByEmailRepository,
  GetUserByIdRepository,
  UpdateUserRepository,
} from "./src/repositories/index.js"
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from "./src/useCases/index.js"

const app = express()

app.use(express.json())

app.post("/api/users", async (request, response) => {
  const createUserRepository = new CreateUserRepository()
  const getUserByEmailRepository = new GetUserByEmailRepository()

  const createUserUseCase = new CreateUserUseCase(
    getUserByEmailRepository,
    createUserRepository,
  )

  const createUserController = new CreateUserController(createUserUseCase)

  const { statusCode, body } = await createUserController.handle(request)

  response.status(statusCode).send(body)
})

app.patch("/api/users/:userId", async (request, response) => {
  const updateUserRepository = new UpdateUserRepository()
  const getUserByEmailRepository = new GetUserByEmailRepository()

  const updateUserUseCase = new UpdateUserUseCase(
    getUserByEmailRepository,
    updateUserRepository,
  )

  const updateUserController = new UpdateUserController(updateUserUseCase)

  const { statusCode, body } = await updateUserController.handle(request)

  response.status(statusCode).send(body)
})

app.get("/api/users/:userId", async (request, response) => {
  const getUserByIdRepository = new GetUserByIdRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository)
  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  const { statusCode, body } = await getUserByIdController.handle(request)

  response.status(statusCode).send(body)
})

app.delete("/api/users/:userId", async (request, response) => {
  const deleteUserRepository = new DeleteUserRepository()
  const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)
  const deleteUserController = new DeleteUserController(deleteUserUseCase)

  const { statusCode, body } = await deleteUserController.handle(request)

  response.status(statusCode).send(body)
})

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}`),
)
