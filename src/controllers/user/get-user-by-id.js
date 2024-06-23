import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js"

export class GetUserByIdController {
  constructor(getUserByIdUseCase) {
    this.getUserByIdUseCase = getUserByIdUseCase
  }

  async handle(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const user = await this.getUserByIdUseCase.execute(
        httpRequest.params.userId,
      )

      if (!user) {
        return userNotFoundResponse()
      }

      return ok(user)
    } catch (error) {
      console.error("Error =>", error)
      return serverError()
    }
  }
}
