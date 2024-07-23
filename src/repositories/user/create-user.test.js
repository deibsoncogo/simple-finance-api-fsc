import { user } from "../../tests/index.js"
import { CreateUserRepository } from "./create-user.js"
import { prisma } from "../../../prisma/prisma.js"

describe("Create user repository", () => {
  test("Should create a user on data base", async () => {
    const sut = new CreateUserRepository()

    const result = await sut.execute(user)

    expect(result.id).toBe(user.id)
  })

  test("Should call Prisma with correct params", async () => {
    const sut = new CreateUserRepository()

    const executeSpy = jest.spyOn(prisma.users, "create")

    await sut.execute(user)

    expect(executeSpy).toHaveBeenCalledWith({ data: user })
  })
})
