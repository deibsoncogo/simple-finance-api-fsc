import { UserNotFoundError } from "../../errors/index.js"
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  requiredFieldIsMissingResponse,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js"

export class GetTransactionsByUserIdController {
  constructor(getTransactionsByUserIdUseCase) {
    this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
  }

  async handle(httpRequest) {
    try {
      const userId = httpRequest.query.userId

      if (!userId) {
        return requiredFieldIsMissingResponse("userId")
      }

      const userIdIsValid = checkIfIdIsValid(userId)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      const transactions =
        await this.getTransactionsByUserIdUseCase.execute(userId)

      return ok(transactions)
    } catch (error) {
      console.error("Error =>", error)

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }

      return serverError()
    }
  }
}
