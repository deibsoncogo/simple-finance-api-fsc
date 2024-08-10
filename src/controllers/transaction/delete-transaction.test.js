import { TransactionNotFoundError } from "../../errors/transaction.js"
import { transaction } from "../../tests/index.js"
import { DeleteTransactionController } from "./delete-transaction.js"

describe("Delete transaction controller", () => {
  const httpRequest = {
    params: { transactionId: transaction.id },
  }

  class DeleteTransactionUseCaseStub {
    async execute(transactionId) {
      return {
        ...transaction,
        id: transactionId,
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

    import.meta.jest
      .spyOn(deleteTransactionUseCaseStub, "execute")
      .mockRejectedValueOnce(new TransactionNotFoundError())

    const result = await deleteTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should return 500 when deleteTransactionUseCaseStub throws", async () => {
    const { deleteTransactionUseCaseStub, deleteTransactionController } =
      makeSut()

    import.meta.jest
      .spyOn(deleteTransactionUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await deleteTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call deleteTransactionUseCaseStub with correct params", async () => {
    const { deleteTransactionUseCaseStub, deleteTransactionController } =
      makeSut()

    const executeSpy = import.meta.jest.spyOn(
      deleteTransactionUseCaseStub,
      "execute",
    )

    await deleteTransactionController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.transactionId)
  })
})
