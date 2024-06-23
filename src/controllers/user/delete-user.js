import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
  userNotFoundResponse,
} from "../helpers/index.js"

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async handle(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const idIsValid = checkIfIdIsValid(userId)

      if (!idIsValid) {
        return invalidIdResponse()
      }

      const deletedUser = await this.deleteUserUseCase.execute(userId)

      if (!deletedUser) {
        return userNotFoundResponse()
      }

      return ok(deletedUser)
    } catch (error) {
      console.error("Error =>", error)
      return serverError()
    }
  }
}
