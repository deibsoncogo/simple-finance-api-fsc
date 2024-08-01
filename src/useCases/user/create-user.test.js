import { EmailAlreadyInUseError } from "../../errors/index.js"
import { userPartial as user } from "../../tests/index.js"
import { CreateUserUseCase } from "./create-user.js"

describe("Create user use case", () => {
  class CreateUserRepositoryStub {
    async execute(user) {
      return user
    }
  }

  class GetUserByEmailRepositoryStub {
    async execute() {
      return null
    }
  }

  class PasswordHashAdapterStub {
    async execute() {
      return "hashed-password"
    }
  }

  class IdGeneratorAdapterStub {
    async execute() {
      return "generated-id"
    }
  }

  const makeSut = () => {
    const createUserRepositoryStub = new CreateUserRepositoryStub()
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
    const passwordHashAdapterStub = new PasswordHashAdapterStub()
    const idGeneratorAdapterStub = new IdGeneratorAdapterStub()

    const createUserUseCase = new CreateUserUseCase(
      idGeneratorAdapterStub,
      passwordHashAdapterStub,
      getUserByEmailRepositoryStub,
      createUserRepositoryStub,
    )

    return {
      idGeneratorAdapterStub,
      passwordHashAdapterStub,
      getUserByEmailRepositoryStub,
      createUserRepositoryStub,
      createUserUseCase,
    }
  }

  test("Should successfully create a user", async () => {
    const { createUserUseCase } = makeSut()

    const result = await createUserUseCase.execute(user)

    expect(result).toBeTruthy()
  })

  test("Should throw an EmailAlreadyInUseError if GetUserByEmailRepositoryStub returns a user", async () => {
    const { getUserByEmailRepositoryStub, createUserUseCase } = makeSut()

    jest
      .spyOn(getUserByEmailRepositoryStub, "execute")
      .mockReturnValueOnce(user)

    const result = createUserUseCase.execute(user)

    expect(result).rejects.toThrow(new EmailAlreadyInUseError(user.email))
  })

  test("Should call IdGeneratorAdapterStub to generate a random id", async () => {
    const {
      idGeneratorAdapterStub,
      createUserRepositoryStub,
      createUserUseCase,
    } = makeSut()

    const idGeneratorSpy = jest.spyOn(idGeneratorAdapterStub, "execute")

    const createUserRepositorySpy = jest.spyOn(
      createUserRepositoryStub,
      "execute",
    )

    await createUserUseCase.execute(user)

    expect(idGeneratorSpy).toHaveBeenCalled()

    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: "hashed-password",
      id: "generated-id",
    })
  })

  test("Should call PasswordHashAdapterStub to cryptograph password", async () => {
    const {
      passwordHashAdapterStub,
      createUserRepositoryStub,
      createUserUseCase,
    } = makeSut()

    const passwordHashStub = jest.spyOn(passwordHashAdapterStub, "execute")

    const createUserRepositorySpy = jest.spyOn(
      createUserRepositoryStub,
      "execute",
    )

    await createUserUseCase.execute(user)

    expect(passwordHashStub).toHaveBeenCalledWith(user.password)

    expect(createUserRepositorySpy).toHaveBeenCalledWith({
      ...user,
      password: "hashed-password",
      id: "generated-id",
    })
  })

  test("Should throw if IdGeneratorAdapterStub throws", async () => {
    const { idGeneratorAdapterStub, createUserUseCase } = makeSut()

    jest.spyOn(idGeneratorAdapterStub, "execute").mockImplementationOnce(() => {
      throw new Error()
    })

    const result = createUserUseCase.execute(user)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if GetUserByEmailRepositoryStub throws", async () => {
    const { getUserByEmailRepositoryStub, createUserUseCase } = makeSut()

    jest
      .spyOn(getUserByEmailRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = createUserUseCase.execute(user)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if PasswordHashAdapterStub throws", async () => {
    const { passwordHashAdapterStub, createUserUseCase } = makeSut()

    jest
      .spyOn(passwordHashAdapterStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = createUserUseCase.execute(user)

    await expect(result).rejects.toThrow()
  })

  test("Should throw if CreateUserRepositoryStub throws", async () => {
    const { createUserRepositoryStub, createUserUseCase } = makeSut()

    jest
      .spyOn(createUserRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = createUserUseCase.execute(user)

    await expect(result).rejects.toThrow()
  })
})
