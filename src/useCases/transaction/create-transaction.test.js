import { CreateTransactionUseCase } from "./create-transaction.js"
import { UserNotFoundError } from "../../errors/index.js"
import { user, transactionPartial as transaction } from "../../tests/index.js"

describe("Create transaction use case", () => {
  class CreateTransactionRepositoryStub {
    async execute(data) {
      return { ...transaction, ...data }
    }
  }

  class GetUserByIdRepositoryStub {
    async execute(userId) {
      return { ...user, id: userId }
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return "generated-id"
    }
  }

  const makeSut = () => {
    const createTransactionRepositoryStub =
      new CreateTransactionRepositoryStub()

    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
    const idGeneratorAdapterStub = new IdGeneratorAdapterStub()

    const sut = new CreateTransactionUseCase(
      idGeneratorAdapterStub,
      getUserByIdRepositoryStub,
      createTransactionRepositoryStub,
    )

    return {
      sut,
      idGeneratorAdapterStub,
      getUserByIdRepositoryStub,
      createTransactionRepositoryStub,
    }
  }

  test("Should successfully create a transaction", async () => {
    const { sut } = makeSut()

    const result = await sut.execute(transaction)

    expect(result).toBeTruthy()
  })

  test("Should call GetUserByIdRepositoryStub with correct params", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    const executeSpy = import.meta.jest.spyOn(
      getUserByIdRepositoryStub,
      "execute",
    )

    await sut.execute(transaction)

    expect(executeSpy).toHaveBeenCalledWith(transaction.userId)
  })

  test("Should call IdGeneratorAdapterStub with correct params", async () => {
    const { sut, idGeneratorAdapterStub } = makeSut()

    const executeSpy = import.meta.jest.spyOn(idGeneratorAdapterStub, "execute")

    await sut.execute(transaction)

    expect(executeSpy).toHaveBeenCalled()
  })

  test("Should call CreateTransactionRepositoryStub with correct params", async () => {
    const { sut, createTransactionRepositoryStub } = makeSut()

    const executeSpy = import.meta.jest.spyOn(
      createTransactionRepositoryStub,
      "execute",
    )

    await sut.execute(transaction)

    expect(executeSpy).toHaveBeenCalledWith({
      ...transaction,
      id: "generated-id",
    })
  })

  test("Should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    import.meta.jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockReturnValueOnce(null)

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow(
      new UserNotFoundError(transaction.userId),
    )
  })

  test("Should throw if GetUserByIdRepositoryStub throws", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    import.meta.jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if IdGeneratorAdapterStub throws", async () => {
    const { sut, idGeneratorAdapterStub } = makeSut()

    import.meta.jest
      .spyOn(idGeneratorAdapterStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if CreateTransactionRepositoryStub throws", async () => {
    const { sut, createTransactionRepositoryStub } = makeSut()

    import.meta.jest
      .spyOn(createTransactionRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow()
  })
})
