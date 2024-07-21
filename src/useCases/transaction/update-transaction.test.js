import { faker } from "@faker-js/faker"
import { UpdateTransactionUseCase } from "./update-transaction"

describe("Update transaction use case", () => {
  const transaction = {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: "expense",
    amount: Number(faker.finance.amount()),
  }

  class UpdateTransactionRepositoryStub {
    async execute(transactionId) {
      return { ...transaction, id: transactionId }
    }
  }

  const makeSut = () => {
    const updateTransactionRepositoryStub =
      new UpdateTransactionRepositoryStub()

    const sut = new UpdateTransactionUseCase(updateTransactionRepositoryStub)

    return { sut, updateTransactionRepositoryStub }
  }

  test("Should successfully update a transaction", async () => {
    const { sut } = makeSut()

    const result = await sut.execute(transaction.id, {
      amount: transaction.amount,
    })

    expect(result).toEqual(transaction)
  })

  test("Should call UpdateTransactionRepositoryStub with correct params", async () => {
    const { sut, updateTransactionRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(updateTransactionRepositoryStub, "execute")

    await sut.execute(transaction.id, {
      amount: transaction.amount,
    })

    expect(executeSpy).toHaveBeenCalledWith(transaction.id, {
      amount: transaction.amount,
    })
  })

  test("Should throw if UpdateTransactionRepositoryStub throws", async () => {
    const { sut, updateTransactionRepositoryStub } = makeSut()

    jest
      .spyOn(updateTransactionRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction.id, {
      amount: transaction.amount,
    })

    await expect(result).rejects.toThrow()
  })
})
