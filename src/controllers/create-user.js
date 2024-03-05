import validator from "validator"
import { EmailAlreadyInUseError } from "../errors/user.js"
import { CreateUserUseCase } from "../useCases/create-user.js"
import { badRequest, created, serverError } from "./helpers.js"

export class CreateUserController {
  async handle(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ["first_name", "last_name", "email", "password"]

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      const passwordIsNotValid = params.password.length < 6

      if (passwordIsNotValid) {
        return badRequest({ message: "Password must be at least 6 characters" })
      }

      const emailIsValid = validator.isEmail(params.email)

      if (!emailIsValid) {
        return badRequest({
          message: "Invalid email, please provide a valid one",
        })
      }

      const createUserUseCase = new CreateUserUseCase()

      const createdUser = await createUserUseCase.execute(params)

      return created(createdUser)
    } catch (error) {
      console.error("Error =>", error)

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
