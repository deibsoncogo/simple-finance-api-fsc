import { EmailAlreadyInUseError } from "../errors/user.js"
import {
  badRequest,
  checkIfEmailIsValid,
  checkIfPasswordIsValid,
  created,
  emailIsAlreadyInUseResponse,
  invalidPasswordResponse,
  serverError,
} from "./helpers/index.js"

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  async handle(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ["first_name", "last_name", "email", "password"]

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      const passwordIsValid = checkIfPasswordIsValid(params.password)

      if (!passwordIsValid) {
        return invalidPasswordResponse()
      }

      const emailIsValid = checkIfEmailIsValid(params.email)

      if (!emailIsValid) {
        return emailIsAlreadyInUseResponse()
      }

      const createdUser = await this.createUserUseCase.execute(params)

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
