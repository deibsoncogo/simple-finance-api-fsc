import { faker } from "@faker-js/faker"
import { DeleteTransactionController } from "./delete-transaction.js"

describe("Delete transaction controller", () => {
  class DeleteTransactionUseCaseStub {
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
    const deleteTransactionUseCaseStub = new DeleteTransactionUseCaseStub()
    const deleteTransactionController = new DeleteTransactionController(
      deleteTransactionUseCaseStub,
    )

    return { deleteTransactionUseCaseStub, deleteTransactionController }
  }

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
  }

  test("Should return 200 when deleting a transaction successfully", async () => {
    const { deleteTransactionController } = makeSut()

    const result = await deleteTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  test("Should return 400 when id is invalid", async () => {
    const { deleteTransactionController } = makeSut()

    const result = await deleteTransactionController.handle({
      params: { transactionId: "invalid" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 404 when transaction is not found", async () => {
    const { deleteTransactionUseCaseStub, deleteTransactionController } =
      makeSut()

    jest
      .spyOn(deleteTransactionUseCaseStub, "execute")
      .mockResolvedValueOnce(null)

    const result = await deleteTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should return 500 when deleteTransactionUseCaseStub throws", async () => {
    const { deleteTransactionUseCaseStub, deleteTransactionController } =
      makeSut()

    jest
      .spyOn(deleteTransactionUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await deleteTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })
})
