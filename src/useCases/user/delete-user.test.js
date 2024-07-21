import { user } from "../../tests/index.js"
import { DeleteUserUseCase } from "./delete-user.js"

describe("Delete user use case", () => {
  class DeleteUserRepositoryStub {
    async execute() {
      return user
    }
  }

  const makeSut = () => {
    const deleteUserRepositoryStub = new DeleteUserRepositoryStub()

    const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepositoryStub)

    return { deleteUserUseCase, deleteUserRepositoryStub }
  }

  test("Should successfully delete a user", async () => {
    const { deleteUserUseCase } = makeSut()

    const result = await deleteUserUseCase.execute(user.id)

    expect(result).toEqual(user)
  })

  test("Should call DeleteUserRepositoryStub with correct params", async () => {
    const { deleteUserUseCase, deleteUserRepositoryStub } = makeSut()

    const executeSpy = jest.spyOn(deleteUserRepositoryStub, "execute")

    await deleteUserUseCase.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith(user.id)
  })

  test("Should throw if DeleteUserRepositoryStub throws", async () => {
    const { deleteUserUseCase, deleteUserRepositoryStub } = makeSut()

    jest
      .spyOn(deleteUserRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = deleteUserUseCase.execute(user.id)

    expect(result).rejects.toThrow()
  })
})
