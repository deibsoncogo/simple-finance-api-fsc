import { faker } from "@faker-js/faker"
import { CreateUserController } from "./create-user"
import { EmailAlreadyInUseError } from "../../errors/user"

describe("Create user controller", () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  test("Should return 201 when creating a user successfully", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(201)
    expect(result.body).not.toBeUndefined()
    expect(result.body).not.toBeNull()
  })

  test("Should return 400 if firstName is not provided", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        lastName: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if lastName is not provided", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if email is not provided", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        lastName: faker.person.firstName(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if email is not valid", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        lastName: faker.person.firstName(),
        email: "userTest@email",
        password: faker.internet.password({ length: 7 }),
      },
    }

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if password is not provided", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        lastName: faker.person.firstName(),
        email: faker.internet.email(),
      },
    }

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 if password is less than 6 characters", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        lastName: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 4 }),
      },
    }

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  test("Should call CreateUserUseCase with correct params", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        lastName: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    const executeSpy = jest.spyOn(createUserUseCaseStub, "execute")

    await createUserController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test("Should return 500 if CreateUserUseCase throws", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        lastName: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    jest.spyOn(createUserUseCaseStub, "execute").mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should return 500 if CreateUserUseCase throws emailAlreadyInUseError", async () => {
    const createUserUseCaseStub = new CreateUserUseCaseStub()
    const createUserController = new CreateUserController(createUserUseCaseStub)

    const httpRequest = {
      body: {
        firstName: faker.person.lastName(),
        lastName: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 7 }),
      },
    }

    jest.spyOn(createUserUseCaseStub, "execute").mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError(httpRequest.body.email)
    })

    const result = await createUserController.handle(httpRequest)

    expect(result.statusCode).toBe(400)
  })
})
