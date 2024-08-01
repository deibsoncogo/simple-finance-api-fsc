import { ZodError } from "zod"
import { EmailAlreadyInUseError } from "../../errors/index.js"
import { updateUserSchema } from "../../schemas/user.js"
import {
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from "../helpers/index.js"

export class UpdateUserController {
  constructor(updateUserUseCase) {
    this.updateUserUseCase = updateUserUseCase
  }

  async handle(httpRequest) {
    try {
      const userId = httpRequest.params.userId
      const params = httpRequest.body

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      await updateUserSchema.parseAsync(params)

      const updateUser = await this.updateUserUseCase.execute(userId, params)

      return ok(updateUser)
    } catch (error) {
      console.error("Error =>", error)

      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message })
      }

      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }

      return serverError()
    }
  }
}
