import { ZodError } from "zod"
import { UserNotFoundError } from "../../errors/user.js"
import { createTransactionSchema } from "../../schemas/index.js"
import {
  badRequest,
  created,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js"

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async handle(httpRequest) {
    try {
      const params = httpRequest.body

      await createTransactionSchema.parseAsync(params)

      const transaction = await this.createTransactionUseCase.execute(params)

      return created(transaction)
    } catch (error) {
      console.error("Error =>", error)

      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message })
      }

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
