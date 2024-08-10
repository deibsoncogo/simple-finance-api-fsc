import { user } from "../../tests/index.js"
import { GetUserByIdController } from "./get-user-by-id.js"

describe("Get user by id controller", () => {
  const httpRequest = {
    params: { userId: user.id },
  }

  class GetUserByIdUseCaseStub {
    async execute(userId) {
      return {
        ...user,
        id: userId,
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

    import.meta.jest
      .spyOn(getUserByIdUseCaseStub, "execute")
      .mockResolvedValueOnce(null)

    const result = await getUserByIdController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should return 500 if getUserByIdUseCaseStub throws an error", async () => {
    const { getUserByIdUseCaseStub, getUserByIdController } = makeSut()

    import.meta.jest
      .spyOn(getUserByIdUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await getUserByIdController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call getUserByIdUseCaseStub with correct params", async () => {
    const { getUserByIdUseCaseStub, getUserByIdController } = makeSut()

    const executeSpy = import.meta.jest.spyOn(getUserByIdUseCaseStub, "execute")

    await getUserByIdController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
  })
})
