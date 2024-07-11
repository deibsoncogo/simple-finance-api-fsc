import { faker } from "@faker-js/faker"
import { GetUserBalanceController } from "./get-user-balance.js"

describe("Get user balance controller", () => {
  class GetUserBalanceUseCaseStub {
    async execute(userId) {
      console.log(userId)
      return faker.number.int()
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCaseStub = new GetUserBalanceUseCaseStub()

    const getUserBalanceController = new GetUserBalanceController(
      getUserBalanceUseCaseStub,
    )

    return { getUserBalanceUseCaseStub, getUserBalanceController }
  }

  const httpRequest = { params: { userId: faker.string.uuid() } }

  test("Should return 200 when getting user balance", async () => {
    const { getUserBalanceController } = makeSut()

    const result = await getUserBalanceController.handle(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  test("Should return 400 when userId is invalid", async () => {
    const { getUserBalanceController } = makeSut()

    const result = await getUserBalanceController.handle({
      params: { userId: "invalid" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 500 if getUserBalanceUseCaseStub throws", async () => {
    const { getUserBalanceUseCaseStub, getUserBalanceController } = makeSut()

    jest
      .spyOn(getUserBalanceUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await getUserBalanceController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call getUserBalanceUseCaseStub with correct params", async () => {
    const { getUserBalanceUseCaseStub, getUserBalanceController } = makeSut()

    const executeSpy = jest.spyOn(getUserBalanceUseCaseStub, "execute")

    await getUserBalanceController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
  })
})
