import { UserNotFoundError } from "../../errors/index.js"
import { user } from "../../tests/index.js"
import { GetTransactionsByUserIdUseCase } from "./get-transactions-by-user-id.js"

describe("Get transactions by userId use case", () => {
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

    import.meta.jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockResolvedValueOnce(null)

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow(new UserNotFoundError(user.id))
  })

  test("Should call GetUserByIdRepositoryStub with correct params", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    const executeSpy = import.meta.jest.spyOn(
      getUserByIdRepositoryStub,
      "execute",
    )

    await sut.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should call GetTransactionsByUserIdRepositoryStub with correct params", async () => {
    const { sut, getTransactionsByUserIdRepositoryStub } = makeSut()

    const executeSpy = import.meta.jest.spyOn(
      getTransactionsByUserIdRepositoryStub,
      "execute",
    )

    await sut.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should throw if GetUserByIdRepositoryStub throws", async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()

    import.meta.jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if GetTransactionsByUserIdRepositoryStub throws", async () => {
    const { sut, getTransactionsByUserIdRepositoryStub } = makeSut()

    import.meta.jest
      .spyOn(getTransactionsByUserIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow()
  })
})
