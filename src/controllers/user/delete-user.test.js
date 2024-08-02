import { UserNotFoundError } from "../../errors/user.js"
import { user } from "../../tests/index.js"
import { DeleteUserController } from "./delete-user.js"

describe("Delete user controller", () => {
  const httpRequest = {
    params: { userId: user.id },
  }

  class DeleteUserUseCaseStub {
    async execute(userId) {
      return { ...user, id: userId }
    }
  }

  const makeSut = () => {
    const deleteUserUseCaseStub = new DeleteUserUseCaseStub()
    const deleteUserController = new DeleteUserController(deleteUserUseCaseStub)

    return { deleteUserUseCaseStub, deleteUserController }
  }

  test("Should return 200 if user is deleted", async () => {
    const { deleteUserController } = makeSut()

    const result = await deleteUserController.handle(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  test("Should return 400 if id is invalid", async () => {
    const { deleteUserController } = makeSut()

    const result = await deleteUserController.handle({
      params: { ...httpRequest.body, userId: "invalid" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 404 if user is not found", async () => {
    const { deleteUserUseCaseStub, deleteUserController } = makeSut()

    jest
      .spyOn(deleteUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new UserNotFoundError())

    const result = await deleteUserController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should return 500 if deleteUserUseCaseStub throws", async () => {
    const { deleteUserUseCaseStub, deleteUserController } = makeSut()

    jest
      .spyOn(deleteUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await deleteUserController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call deleteUserUseCaseStub with correct params", async () => {
    const { deleteUserUseCaseStub, deleteUserController } = makeSut()

    const executeSpy = jest.spyOn(deleteUserUseCaseStub, "execute")

    await deleteUserController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
  })
})
