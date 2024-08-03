import { Router } from "express"
import {
  makeCreateTransactionController,
  makeDeleteTransactionController,
  makeGetTransactionsByUserIdController,
  makeUpdateTransactionController,
} from "../factories/controllers/transaction.js"

export const transactionsRouter = Router()

transactionsRouter.post("/", async (request, response) => {
  const createTransactionController = makeCreateTransactionController()

  const { statusCode, body } = await createTransactionController.handle(request)

  response.status(statusCode).send(body)
})

transactionsRouter.get("/", async (request, response) => {
  const getTransactionsByUserIdController =
    makeGetTransactionsByUserIdController()

  const { statusCode, body } =
    await getTransactionsByUserIdController.handle(request)

  response.status(statusCode).send(body)
})

transactionsRouter.patch("/:transactionId", async (request, response) => {
  const updateTransactionController = makeUpdateTransactionController()

  const { statusCode, body } = await updateTransactionController.handle(request)

  response.status(statusCode).send(body)
})

transactionsRouter.delete("/:transactionId", async (request, response) => {
  const deleteTransactionController = makeDeleteTransactionController()

  const { statusCode, body } = await deleteTransactionController.handle(request)

  response.status(statusCode).send(body)
})
