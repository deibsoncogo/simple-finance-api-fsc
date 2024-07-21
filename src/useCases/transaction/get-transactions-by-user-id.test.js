import { faker } from "@faker-js/faker"
import { GetTransactionsByUserIdUseCase } from "./get-transactions-by-user-id"
import { UserNotFoundError } from "../../errors/user"

describe("Get transactions by userId use case", () => {
  const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }

  class GetTransactionsByUserIdRepositoryStub {
    async execute() {
      return []
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdRepositoryStub =
      new GetTransactionsByUserIdRepositoryStub()

    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

    const sut = new GetTransactionsByUserIdUseCase(
      getUserByIdRepositoryStub,
      getTransactionsByUserIdRepositoryStub,
    )

    return {
      sut,
      getTransactionsByUserIdRepositoryStub,
      getUserByIdRepositoryStub,
    }
  }

  test("Should get transactions by user id successfully", async () => {
    const { sut } = makeSut()

    const result = await sut.execute(user.id)

    expect(result).toEqual([])
  })

  test("Should throw UserNotFoundError if user does not exist", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, "execute").mockResolvedValueOnce(null)

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow(new UserNotFoundError(user.id))
  })

  test("Should call GetUserByIdRepositoryStub with correct params", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(getUserByIdRepositoryStub, "execute")

    await sut.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should call GetTransactionsByUserIdRepositoryStub with correct params", async () => {
    const { sut, getTransactionsByUserIdRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(
      getTransactionsByUserIdRepositoryStub,
      "execute",
    )

    await sut.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should throw if GetUserByIdRepositoryStub throws", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if GetTransactionsByUserIdRepositoryStub throws", async () => {
    const { sut, getTransactionsByUserIdRepositoryStub } = makeSut()

    jest
      .spyOn(getTransactionsByUserIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow()
  })
})
