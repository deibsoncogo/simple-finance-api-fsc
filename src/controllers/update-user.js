import { EmailAlreadyInUseError } from "../errors/user.js"
import { UpdateUserUseCase } from "../useCases/index.js"
import {
  badRequest,
  checkIfEmailIsValid,
  checkIfIdIsValid,
  checkIfPasswordIsValid,
  emailIsAlreadyInUseResponse,
  invalidIdResponse,
  invalidPasswordResponse,
  ok,
  serverError,
} from "./helpers/index.js"

export class UpdateUserController {
  async handle(httpRequest) {
    try {
      const userId = httpRequest.params.userId
      const params = httpRequest.body

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const allowedFields = ["first_name", "last_name", "email", "password"]

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return badRequest({ message: "Some provided field is not allowed" })
      }

      if (params.password) {
        const passwordIsValid = checkIfPasswordIsValid(params.password)

        if (!passwordIsValid) {
          return invalidPasswordResponse()
        }
      }

      if (params.email) {
        const emailIsValid = checkIfEmailIsValid(params.email)

        if (!emailIsValid) {
          return emailIsAlreadyInUseResponse()
        }
      }

      const updateUserUseCase = new UpdateUserUseCase()

      const updateUser = await updateUserUseCase.execute(userId, params)

      return ok(updateUser)
    } catch (error) {
      console.error("Error =>", error)

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
