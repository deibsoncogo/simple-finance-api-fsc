import { faker } from "@faker-js/faker"
import { GetUserByIdUseCase } from "./get-user-by-id.js"

describe("Get user by id use case", () => {
  const user = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 7 }),
  }

  class GetUserByIdRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

    const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepositoryStub)

    return { getUserByIdUseCase, getUserByIdRepositoryStub }
  }

  test("Should successfully get user by id", async () => {
    const { getUserByIdUseCase } = makeSut()

    const result = await getUserByIdUseCase.execute(user.id)

    expect(result).toEqual(user)
  })

  test("Should call GetUserByIdRepositoryStub with correct params", async () => {
    const { getUserByIdUseCase, getUserByIdRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(getUserByIdRepositoryStub, "execute")

    await getUserByIdUseCase.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should throw if getUserByIdRepositoryStub throws", async () => {
    const { getUserByIdUseCase, getUserByIdRepositoryStub } = makeSut()

    jest
      .spyOn(getUserByIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = getUserByIdUseCase.execute(user.id)

    expect(result).rejects.toThrow()
  })
})
