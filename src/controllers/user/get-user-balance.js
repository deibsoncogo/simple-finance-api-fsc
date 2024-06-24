import { UserNotFoundError } from "../../errors/user.js"
import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js"

export class GetUserBalanceController {
  constructor(getUserBalanceUseCase) {
    this.getUserBalanceUseCase = getUserBalanceUseCase
  }

  async handle(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const balance = await this.getUserBalanceUseCase.execute(userId)

      return ok(balance)
    } catch (error) {
      console.error("Error =>", error)

      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse()
      }
      return serverError()
    }
  }
}
