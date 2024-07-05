import { faker } from "@faker-js/faker"
import { DeleteUserController } from "./delete-user.js"

describe("Delete user controller", () => {
  class DeleteUserUseCaseStub {
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
    const deleteUserUseCaseStub = new DeleteUserUseCaseStub()
    const deleteUserController = new DeleteUserController(deleteUserUseCaseStub)

    return { deleteUserUseCaseStub, deleteUserController }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
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

    jest.spyOn(deleteUserUseCaseStub, "execute").mockResolvedValueOnce(null)

    const result = await deleteUserController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should return 500 if DeleteUserUseCase throws", async () => {
    const { deleteUserUseCaseStub, deleteUserController } = makeSut()

    jest
      .spyOn(deleteUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await deleteUserController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })
})
