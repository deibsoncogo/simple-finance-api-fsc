import {
  badRequest,
  checkIfAmountIsValid,
  checkIfIdIsValid,
  checkIfTypeIsValid,
  created,
  invalidIdResponse,
  invalidTypeResponse,
  requiredFieldIsMissingResponse,
  serverError,
  validateRequiredFields,
} from "../helpers/index.js"

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async handle(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ["user_id", "name", "date", "amount", "type"]

      const { ok: requiredFieldsWereProvided, missingField } =
        validateRequiredFields(params, requiredFields)

      if (!requiredFieldsWereProvided) {
        return requiredFieldIsMissingResponse(missingField)
      }

      const userIdIsValid = checkIfIdIsValid(params.user_id)

      if (!userIdIsValid) {
        return invalidIdResponse()
      }

      const amountIsValid = checkIfAmountIsValid(params.amount)

      if (!amountIsValid) {
        return badRequest({ message: "The amount must be a valid currency" })
      }

      const type = params.type.trim().toUpperCase()

      const typeIsValid = checkIfTypeIsValid(type)

      if (!typeIsValid) {
        return invalidTypeResponse()
      }

      const transaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      })

      return created(transaction)
    } catch (error) {
      console.error("Error =>", error)
      return serverError()
    }
  }
}
