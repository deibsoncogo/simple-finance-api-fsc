import { user } from "../../tests/index.js"
import { DeleteUserRepository } from "./delete-user.js"
import { prisma } from "../../../prisma/prisma.js"

describe("Delete user repository", () => {
  test("Should delete a user on data base", async () => {
    await prisma.users.create({ data: user })

    const sut = new DeleteUserRepository()

    const result = await sut.execute(user.id)

    expect(result).toStrictEqual(user)
  })

  test("Should call Prisma with correct params", async () => {
    const sut = new DeleteUserRepository()

    const executeSpy = jest.spyOn(prisma.users, "delete")

    await sut.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith({ where: { id: user.id } })
  })
})
