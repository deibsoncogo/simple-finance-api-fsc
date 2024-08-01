import { faker } from "@faker-js/faker"
import { EmailAlreadyInUseError } from "../../errors/index.js"
import { userPartial } from "../../tests/index.js"
import { CreateUserController } from "./create-user.js"

describe("Create user controller", () => {
  const httpRequest = {
    body: userPartial,
  }

  class CreateUserUseCaseStub {
    async execute(user) {
      return user
    }
  }

  const makeSut = () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    return { createUserUseCaseStub, createUserController }
  }

  test("Should return 201 when creating a user successfully", async () => {
    const { createUserController } = makeSut()

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(httpRequest.body)
  })

  test("Should return 400 if firstName is not provided", async () => {
    const { createUserController } = makeSut()

    const result = await createUserController.handle({
      body: { ...httpRequest.body, firstName: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if lastName is not provided", async () => {
    const { createUserController } = makeSut()

    const result = await createUserController.handle({
      body: { ...httpRequest.body, lastName: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if email is not provided", async () => {
    const { createUserController } = makeSut()

    const result = await createUserController.handle({
      body: { ...httpRequest.body, email: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if email is not valid", async () => {
    const { createUserController } = makeSut()

    const result = await createUserController.handle({
      body: { ...httpRequest.body, email: "userTest@email" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if password is not provided", async () => {
    const { createUserController } = makeSut()

    const result = await createUserController.handle({
      body: { ...httpRequest.body, password: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if password is less than 6 characters", async () => {
    const { createUserController } = makeSut()

    const result = await createUserController.handle({
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 4 }),
      },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should call createUserUseCaseStub with correct params", async () => {
    const { createUserController, createUserUseCaseStub } = makeSut()

    const executeSpy = jest.spyOn(createUserUseCaseStub, "execute")

    await createUserController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("Should return 500 if createUserUseCaseStub throws", async () => {
    const { createUserController, createUserUseCaseStub } = makeSut()

    jest
      .spyOn(createUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should return 500 if createUserUseCaseStub throws emailAlreadyInUseError", async () => {
    const { createUserController, createUserUseCaseStub } = makeSut()

    jest
      .spyOn(createUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new EmailAlreadyInUseError(httpRequest.body.email))

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })
})
