import { ZodError } from "zod"
import { updateTransactionSchema } from "../../schemas/index.js"
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from "../helpers/index.js"

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }

  async handle(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId
      const params = httpRequest.body

      const isIdValid = checkIfIdIsValid(transactionId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      await updateTransactionSchema.parseAsync(params)

      const updateTransaction = await this.updateTransactionUseCase.execute(
        transactionId,
        params,
      )

      return ok(updateTransaction)
    } catch (error) {
      console.error("Error =>", error)

      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message })
      }

      return serverError()
    }
  }
}
