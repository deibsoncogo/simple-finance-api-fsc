import { faker } from "@faker-js/faker"
import { CreateTransactionUseCase } from "./create-transaction"
import { UserNotFoundError } from "../../errors/user"

describe("Create transaction use case", () => {
  const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  const transaction = {
    userId: user.id,
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: "expense",
    amount: Number(faker.finance.amount()),
  }

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

    const executeSpy = jest.spyOn(getUserByIdRepositoryStub, "execute")

    await sut.execute(transaction)

    expect(executeSpy).toHaveBeenCalledWith(transaction.userId)
  })

  test("Should call IdGeneratorAdapterStub with correct params", async () => {
    const { sut, idGeneratorAdapterStub } = makeSut()

    const executeSpy = jest.spyOn(idGeneratorAdapterStub, "execute")

    await sut.execute(transaction)

    expect(executeSpy).toHaveBeenCalled()
  })

  test("Should call CreateTransactionRepositoryStub with correct params", async () => {
    const { sut, createTransactionRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(createTransactionRepositoryStub, "execute")

    await sut.execute(transaction)

    expect(executeSpy).toHaveBeenCalledWith({
      ...transaction,
      id: "generated-id",
    })
  })

  test("Should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, "execute").mockReturnValueOnce(null)

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow(
      new UserNotFoundError(transaction.userId),
    )
  })

  test("Should throw if GetUserByIdRepositoryStub throws", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if IdGeneratorAdapterStub throws", async () => {
    const { sut, idGeneratorAdapterStub } = makeSut()

    jest
      .spyOn(idGeneratorAdapterStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if CreateTransactionRepositoryStub throws", async () => {
    const { sut, createTransactionRepositoryStub } = makeSut()

    jest
      .spyOn(createTransactionRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transaction)

    await expect(result).rejects.toThrow()
  })
})
