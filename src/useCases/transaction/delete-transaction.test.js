import { transaction } from "../../tests/index.js"
import { DeleteTransactionUseCase } from "./delete-transaction"

describe("DeleteTransactionUseCase", () => {
  class DeleteTransactionRepositoryStub {
    async execute(transactionId) {
      return { ...transaction, id: transactionId }
    }
  }

  const makeSut = () => {
    const deleteTransactionRepositoryStub =
      new DeleteTransactionRepositoryStub()

    const sut = new DeleteTransactionUseCase(deleteTransactionRepositoryStub)

    return { sut, deleteTransactionRepositoryStub }
  }

  test("Should delete transaction successfully", async () => {
    const { sut } = makeSut()

    const result = await sut.execute(transaction.id)

    expect(result).toEqual(transaction)
  })

  test("Should call DeleteTransactionRepositoryStub with correct params", async () => {
    const { sut, deleteTransactionRepositoryStub } = makeSut()

    const executeSpy = import.meta.jest.spyOn(
      deleteTransactionRepositoryStub,
      "execute",
    )

    await sut.execute(transaction.id)

    expect(executeSpy).toHaveBeenCalledWith(transaction.id)
  })

  test("Should throw if DeleteTransactionRepositoryStub throws", async () => {
    const { sut, deleteTransactionRepositoryStub } = makeSut()

    import.meta.jest
      .spyOn(deleteTransactionRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction.id)

    await expect(result).rejects.toThrow()
  })
})
