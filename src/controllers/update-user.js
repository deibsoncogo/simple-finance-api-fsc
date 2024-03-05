import validator from "validator"
import { EmailAlreadyInUseError } from "../errors/user.js"
import { UpdateUserUseCase } from "../useCases/update-user.js"
import { badRequest, ok, serverError } from "./helpers.js"

export class UpdateUserController {
  async handle(httpRequest) {
    try {
      const userId = httpRequest.params.userId
      const updateUserParams = httpRequest.body

      const isIdValid = validator.isUUID(userId)

      if (!isIdValid) {
        return badRequest({ message: "The provided id is not valid" })
      }

      const allowedFields = ["first_name", "last_name", "email", "password"]

      const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return badRequest({ message: "Some provided field is not allowed" })
      }

      if (updateUserParams.password) {
        const passwordIsNotValid = updateUserParams.password.length < 6

        if (passwordIsNotValid) {
          return badRequest({
            message: "Password must be at least 6 characters",
          })
        }
      }

      if (updateUserParams.email) {
        const emailIsValid = validator.isEmail(updateUserParams.email)

        if (!emailIsValid) {
          return badRequest({
            message: "Invalid email, please provide a valid one",
          })
        }
      }

      const updateUserUseCase = new UpdateUserUseCase()

      const updateUser = await updateUserUseCase.execute(
        userId,
        updateUserParams,
      )

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
