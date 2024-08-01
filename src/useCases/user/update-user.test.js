import { faker } from "@faker-js/faker"
import { EmailAlreadyInUseError } from "../../errors/index.js"
import { user } from "../../tests/index.js"
import { UpdateUserUseCase } from "./update-user.js"

describe("Update user use case", () => {
  class UpdateUserRepositoryStub {
    async execute() {
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

  const makeSut = () => {
    const updateUserRepositoryStub = new UpdateUserRepositoryStub()
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
    const passwordHashAdapterStub = new PasswordHashAdapterStub()

    const updateUserUseCase = new UpdateUserUseCase(
      passwordHashAdapterStub,
      getUserByEmailRepositoryStub,
      updateUserRepositoryStub,
    )

    return {
      updateUserUseCase,
      passwordHashAdapterStub,
      getUserByEmailRepositoryStub,
      updateUserRepositoryStub,
    }
  }

  test("Should successfully update user (without email and password)", async () => {
    const { updateUserUseCase } = makeSut()

    const result = await updateUserUseCase.execute(user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
    })

    expect(result).toBe(user)
  })

  test("Should successfully update user (with email)", async () => {
    const { updateUserUseCase, getUserByEmailRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(getUserByEmailRepositoryStub, "execute")

    const result = await updateUserUseCase.execute(user.id, {
      email: user.email,
    })

    expect(result).toBe(user)
    expect(executeSpy).toHaveBeenCalledWith(user.email)
  })

  test("Should successfully update user (with password)", async () => {
    const { updateUserUseCase, passwordHashAdapterStub } = makeSut()

    const executeSpy = jest.spyOn(passwordHashAdapterStub, "execute")

    const result = await updateUserUseCase.execute(user.id, {
      password: user.password,
    })

    expect(result).toBe(user)
    expect(executeSpy).toHaveBeenCalledWith(user.password)
  })

  test("Should throw EmailAlreadyInUseError if email is already in use", async () => {
    const { updateUserUseCase, getUserByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(getUserByEmailRepositoryStub, "execute")
      .mockResolvedValueOnce(user)

    const result = updateUserUseCase.execute(faker.string.uuid(), {
      email: user.email,
    })

    await expect(result).rejects.toThrow(new EmailAlreadyInUseError(user.email))
  })

  test("Should call UpdateUserRepositoryStub with correct params", async () => {
    const { updateUserUseCase, updateUserRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(updateUserRepositoryStub, "execute")

    await updateUserUseCase.execute(user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    })

    expect(executeSpy).toHaveBeenCalledWith(user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: "hashed-password",
    })
  })

  test("Should throw if GetUserByEmailRepositoryStub throws", async () => {
    const { updateUserUseCase, getUserByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(getUserByEmailRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = updateUserUseCase.execute(user.id, {
      email: user.email,
    })

    await expect(result).rejects.toThrow()
  })

  test("Should throw if PasswordHashAdapterStub throws", async () => {
    const { updateUserUseCase, passwordHashAdapterStub } = makeSut()

    jest
      .spyOn(passwordHashAdapterStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = updateUserUseCase.execute(user.id, {
      password: user.password,
    })

    await expect(result).rejects.toThrow()
  })

  test("Should throw if UpdateUserRepositoryStub throws", async () => {
    const { updateUserUseCase, updateUserRepositoryStub } = makeSut()

    jest
      .spyOn(updateUserRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = updateUserUseCase.execute(user.id, {
      firstName: user.firstName,
      lastName: user.lastName,
    })

    await expect(result).rejects.toThrow()
  })
})
