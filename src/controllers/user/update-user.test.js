import { faker } from "@faker-js/faker"
import { UpdateUserController } from "./update-user.js"
import { EmailAlreadyInUseError } from "../../errors/user.js"

describe("Update user controller", () => {
  class UpdateUserUseCaseStub {
    async execute(user) {
      return user
    }
  }

  const makeSut = () => {
    const updateUserUseCaseStub = new UpdateUserUseCaseStub()
    const updateUserController = new UpdateUserController(updateUserUseCaseStub)

    return { updateUserUseCaseStub, updateUserController }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
  }

  test("Should return 200 when updating a user successfully", async () => {
    const { updateUserController } = makeSut()

    const result = await updateUserController.handle(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  test("Should return 400 when an invalid email is provided", async () => {
    const { updateUserController } = makeSut()

    const result = await updateUserController.handle({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        email: "invalid",
      },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when an invalid password is provided", async () => {
    const { updateUserController } = makeSut()

    const result = await updateUserController.handle({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 4 }),
      },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when an invalid id is provided", async () => {
    const { updateUserController } = makeSut()

    const result = await updateUserController.handle({
      params: {
        userId: "invalid",
      },
      body: httpRequest.body,
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when an unallowed field is provided", async () => {
    const { updateUserController } = makeSut()

    const result = await updateUserController.handle({
      params: httpRequest.params,
      body: {
        ...httpRequest.body,
        unallowedField: "unallowedValue",
      },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 500 if UpdateUserUseCaseStub throws with generic error", async () => {
    const { updateUserUseCaseStub, updateUserController } = makeSut()

    jest
      .spyOn(updateUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await updateUserController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should return 400 if UpdateUserUseCaseStub throws EmailAlreadyInUseError", async () => {
    const { updateUserUseCaseStub, updateUserController } = makeSut()

    jest
      .spyOn(updateUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new EmailAlreadyInUseError(faker.internet.email()))

    const result = await updateUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  test("Should call updateUserUseCaseStub with correct params", async () => {
    const { updateUserUseCaseStub, updateUserController } = makeSut()

    const executeSpy = jest.spyOn(updateUserUseCaseStub, "execute")

    await updateUserController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body,
    )
  })
})
