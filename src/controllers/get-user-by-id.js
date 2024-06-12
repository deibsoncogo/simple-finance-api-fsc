import { GetUserByIdUseCase } from "../useCases/index.js"
import {
  checkIfIdIsValid,
  invalidIdResponse,
  notFound,
  ok,
  serverError,
} from "./helpers/index.js"

export class GetUserByIdController {
  async handle(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

      if (!user) {
        return notFound({ message: "User not found" })
      }

      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
