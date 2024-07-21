import { faker } from "@faker-js/faker"
import { DeleteTransactionUseCase } from "./delete-transaction"

describe("DeleteTransactionUseCase", () => {
  const transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: "expense",
    amount: Number(faker.finance.amount()),
  }

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

    const executeSpy = jest.spyOn(deleteTransactionRepositoryStub, "execute")

    await sut.execute(transaction.id)

    expect(executeSpy).toHaveBeenCalledWith(transaction.id)
  })

  test("Should throw if DeleteTransactionRepositoryStub throws", async () => {
    const { sut, deleteTransactionRepositoryStub } = makeSut()

    jest
      .spyOn(deleteTransactionRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction.id)

    await expect(result).rejects.toThrow()
  })
})
