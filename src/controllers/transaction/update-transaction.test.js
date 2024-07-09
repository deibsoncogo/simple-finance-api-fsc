import { faker } from "@faker-js/faker"
import { UpdateTransactionController } from "./update-transaction.js"

describe("Update transaction controller", () => {
  class UpdateTransactionUseCaseStub {
    async execute(transactionId) {
      return {
        id: transactionId,
        userId: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        type: "expense",
        amount: Number(faker.finance.amount()),
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

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: "expense",
      amount: Number(faker.finance.amount()),
    },
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

    jest
      .spyOn(updateTransactionUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await updateTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call updateTransactionUseCaseStub with correct params", async () => {
    const { updateTransactionUseCaseStub, updateTransactionController } =
      makeSut()

    const executeSpy = jest.spyOn(updateTransactionUseCaseStub, "execute")

    await updateTransactionController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.transactionId,
      httpRequest.body,
    )
  })
})
