import { ZodError } from "zod"
import { EmailAlreadyInUseError } from "../../errors/user.js"
import { createUserSchema } from "../../schemas/index.js"
import { badRequest, created, serverError } from "../helpers/index.js"

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  async handle(httpRequest) {
    try {
      const params = httpRequest.body

      await createUserSchema.parseAsync(params)

      const createdUser = await this.createUserUseCase.execute(params)

      return created(createdUser)
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
