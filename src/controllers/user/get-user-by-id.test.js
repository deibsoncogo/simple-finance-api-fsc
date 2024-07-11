import { faker } from "@faker-js/faker"
import { GetUserByIdController } from "./get-user-by-id.js"

describe("Get user by id controller", () => {
  class GetUserByIdUseCaseStub {
    async execute(userId) {
      return {
        id: userId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      }
    }
  }

  const makeSut = () => {
    const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()

    const getUserByIdController = new GetUserByIdController(
      getUserByIdUseCaseStub,
    )

    return { getUserByIdUseCaseStub, getUserByIdController }
  }

  const httpRequest = { params: { userId: faker.string.uuid() } }

  test("Should return 200 if a user is found", async () => {
    const { getUserByIdController } = makeSut()

    const result = await getUserByIdController.handle(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  test("Should return 400 if an invalid id is provided", async () => {
    const { getUserByIdController } = makeSut()

    const result = await getUserByIdController.handle({
      params: { userId: "invalid" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 404 if a user is not found", async () => {
    const { getUserByIdUseCaseStub, getUserByIdController } = makeSut()

    jest.spyOn(getUserByIdUseCaseStub, "execute").mockResolvedValueOnce(null)

    const result = await getUserByIdController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should return 500 if getUserByIdUseCaseStub throws an error", async () => {
    const { getUserByIdUseCaseStub, getUserByIdController } = makeSut()

    jest
      .spyOn(getUserByIdUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await getUserByIdController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call getUserByIdUseCaseStub with correct params", async () => {
    const { getUserByIdUseCaseStub, getUserByIdController } = makeSut()

    const executeSpy = jest.spyOn(getUserByIdUseCaseStub, "execute")

    await getUserByIdController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
  })
})
