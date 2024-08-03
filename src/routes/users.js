import { Router } from "express"
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserBalanceController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from "../factories/controllers/user.js"

export const usersRouter = Router()

usersRouter.post("/", async (request, response) => {
  const createUserController = makeCreateUserController()

  const { statusCode, body } = await createUserController.handle(request)

  response.status(statusCode).send(body)
})

usersRouter.get("/:userId", async (request, response) => {
  const getUserByIdController = makeGetUserByIdController()

  const { statusCode, body } = await getUserByIdController.handle(request)

  response.status(statusCode).send(body)
})

usersRouter.get("/:userId/balance", async (request, response) => {
  const getUserBalanceController = makeGetUserBalanceController()

  const { statusCode, body } = await getUserBalanceController.handle(request)

  response.status(statusCode).send(body)
})

usersRouter.patch("/:userId", async (request, response) => {
  const updateUserController = makeUpdateUserController()

  const { statusCode, body } = await updateUserController.handle(request)

  response.status(statusCode).send(body)
})

usersRouter.delete("/:userId", async (request, response) => {
  const deleteUserController = makeDeleteUserController()

  const { statusCode, body } = await deleteUserController.handle(request)

  response.status(statusCode).send(body)
})
