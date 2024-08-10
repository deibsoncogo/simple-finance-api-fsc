import { TransactionNotFoundError } from "../../errors/transaction.js"
import { transactionPartial, transaction } from "../../tests/index.js"
import { UpdateTransactionController } from "./update-transaction.js"

describe("Update transaction controller", () => {
  const httpRequest = {
    params: { transactionId: transaction.id },
    body: transactionPartial,
  }

  class UpdateTransactionUseCaseStub {
    async execute(transactionId) {
      return {
        ...transaction,
        id: transactionId,
      }
    }
  }

  const makeSut = () => {
    const updateTransactionUseCaseStub = new UpdateTransactionUseCaseStub()
    const updateTransactionController = new UpdateTransactionController(
      updateTransactionUseCaseStub,
    )

    return { updateTransactionUseCaseStub, updateTransactionController }
  }

  test("Should return 200 when updating a transaction successfully", async () => {
    const { updateTransactionController } = makeSut()

    const result = await updateTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  test("Should return 400 when transaction id is invalid", async () => {
    const { updateTransactionController } = makeSut()

    const result = await updateTransactionController.handle({
      params: { transactionId: "invalid" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when unallowed field is provided", async () => {
    const { updateTransactionController } = makeSut()

    const result = await updateTransactionController.handle({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        unallowedField: "unallowedField",
      },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when amount is invalid", async () => {
    const { updateTransactionController } = makeSut()

    const result = await updateTransactionController.handle({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        amount: "invalid",
      },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when type is invalid", async () => {
    const { updateTransactionController } = makeSut()

    const result = await updateTransactionController.handle({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        type: "invalid",
      },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 500 when updateTransactionUseCaseStub throws", async () => {
    const { updateTransactionUseCaseStub, updateTransactionController } =
      makeSut()

    import.meta.jest
      .spyOn(updateTransactionUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await updateTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should return 404 when TransactionNotFoundError is thrown", async () => {
    const { updateTransactionUseCaseStub, updateTransactionController } =
      makeSut()

    import.meta.jest
      .spyOn(updateTransactionUseCaseStub, "execute")
      .mockRejectedValueOnce(new TransactionNotFoundError())

    const result = await updateTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should call updateTransactionUseCaseStub with correct params", async () => {
    const { updateTransactionUseCaseStub, updateTransactionController } =
      makeSut()

    const executeSpy = import.meta.jest.spyOn(
      updateTransactionUseCaseStub,
      "execute",
    )

    await updateTransactionController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.transactionId,
      httpRequest.body,
    )
  })
})
