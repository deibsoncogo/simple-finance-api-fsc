import { faker } from "@faker-js/faker"
import { GetUserBalanceUseCase } from "./get-user-balance.js"
import { UserNotFoundError } from "../../errors/user.js"

describe("Get user balance use case", () => {
  const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  const balance = {
    earnings: faker.finance.amount(),
    expenses: faker.finance.amount(),
    investments: faker.finance.amount(),
    balance: faker.finance.amount(),
  }

  class GetUserBalanceRepositoryStub {
    async execute() {
      return balance
    }
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const getUserBalanceRepositoryStub = new GetUserBalanceRepositoryStub()
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

    const getUserBalanceUseCase = new GetUserBalanceUseCase(
      getUserByIdRepositoryStub,
      getUserBalanceRepositoryStub,
    )

    return {
      getUserBalanceUseCase,
      getUserByIdRepositoryStub,
      getUserBalanceRepositoryStub,
    }
  }

  test("Should successfully get user", async () => {
    const { getUserBalanceUseCase } = makeSut()

    const result = await getUserBalanceUseCase.execute(user.id)

    expect(result).toEqual(balance)
  })

  test("Should throw UserNotFoundError if GetUserByIdRepositoryStub returns null", async () => {
    const { getUserBalanceUseCase, getUserByIdRepositoryStub } = makeSut()

    jest.spyOn(getUserByIdRepositoryStub, "execute").mockResolvedValueOnce(null)

    const result = getUserBalanceUseCase.execute(user.id)

    await expect(result).rejects.toThrow(new UserNotFoundError(user.id))
  })

  test("Should call GetUserByIdRepositoryStub with correct params", async () => {
    const { getUserBalanceUseCase, getUserByIdRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(getUserByIdRepositoryStub, "execute")

    await getUserBalanceUseCase.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should call GetUserBalanceRepositoryStub with correct params", async () => {
    const { getUserBalanceUseCase, getUserBalanceRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(getUserBalanceRepositoryStub, "execute")

    await getUserBalanceUseCase.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should throw if GetUserByIdRepositoryStub throws", async () => {
    const { getUserBalanceUseCase, getUserByIdRepositoryStub } = makeSut()

    jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = getUserBalanceUseCase.execute(user.id)

    expect(result).rejects.toThrow()
  })

  test("Should throw if GetUserBalanceRepositoryStub throws", async () => {
    const { getUserBalanceUseCase, getUserBalanceRepositoryStub } = makeSut()

    jest
      .spyOn(getUserBalanceRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = getUserBalanceUseCase.execute(user.id)

    expect(result).rejects.toThrow()
  })
})
