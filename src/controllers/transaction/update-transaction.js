import {
  badRequest,
  checkIfAmountIsValid,
  checkIfIdIsValid,
  checkIfTypeIsValid,
  invalidAmountResponse,
  invalidIdResponse,
  invalidTypeResponse,
  ok,
  serverError,
} from "../helpers/index.js"

export class UpdateTransactionController {
  constructor(updateTransactionUseCase) {
    this.updateTransactionUseCase = updateTransactionUseCase
  }

  async handle(httpRequest) {
    try {
      const transactionId = httpRequest.params.transactionId
      const params = httpRequest.body

      const isIdValid = checkIfIdIsValid(transactionId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const allowedFields = ["name", "date", "amount", "type"]

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return badRequest({ message: "Some provided field is not allowed" })
      }

      if (params.amount) {
        const amountIsValid = checkIfAmountIsValid(params.amount)

        if (!amountIsValid) {
          return invalidAmountResponse()
        }
      }

      if (params.type) {
        const typeIsValid = checkIfTypeIsValid(params.type)

        if (!typeIsValid) {
          return invalidTypeResponse()
        }
      }

      const updateTransaction = await this.updateTransactionUseCase.execute(
        transactionId,
        params,
      )

      return ok(updateTransaction)
    } catch (error) {
      console.error("Error =>", error)
      return serverError()
    }
  }
}
