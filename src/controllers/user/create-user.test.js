import { faker } from "@faker-js/faker"
import { EmailAlreadyInUseError } from "../../errors/user.js"
import { CreateUserController } from "./create-user.js"

describe("Create user controller", () => {
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

  const httpRequest = {
    body: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
    },
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

  test("Should call CreateUserUseCase with correct params", async () => {
    const { createUserController, createUserUseCaseStub } = makeSut()

    const executeSpy = jest.spyOn(createUserUseCaseStub, "execute")

    await createUserController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("Should return 500 if CreateUserUseCase throws", async () => {
    const { createUserController, createUserUseCaseStub } = makeSut()

    jest
      .spyOn(createUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should return 500 if CreateUserUseCase throws emailAlreadyInUseError", async () => {
    const { createUserController, createUserUseCaseStub } = makeSut()

    jest
      .spyOn(createUserUseCaseStub, "execute")
      .mockRejectedValueOnce(new EmailAlreadyInUseError(httpRequest.body.email))

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })
})
