import validator from "validator"
import { GetUserByIdUseCase } from "../useCases/get-user-by-id.js"
import { badRequest, notFound, ok, serverError } from "./helpers.js"

export class GetUserByIdController {
  async handle(httpRequest) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId)

      if (!isIdValid) {
        return badRequest({ message: "The provided id is not valid" })
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
