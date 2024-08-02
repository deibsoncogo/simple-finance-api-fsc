import { user } from "../../tests/index.js"
import { DeleteUserRepository } from "./delete-user.js"
import { prisma } from "../../../prisma/prisma.js"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { UserNotFoundError } from "../../errors/user.js"

describe("Delete user repository", () => {
  test("Should delete a user on data base", async () => {
    await prisma.users.create({ data: user })

    const sut = new DeleteUserRepository()

    const result = await sut.execute(user.id)

    expect(result).toStrictEqual(user)
  })

  test("Should call Prisma with correct params", async () => {
    await prisma.users.create({ data: user })

    const sut = new DeleteUserRepository()

    const executeSpy = jest.spyOn(prisma.users, "delete")

    await sut.execute(user.id)

    expect(executeSpy).toHaveBeenCalledWith({ where: { id: user.id } })
  })

  test("Should throw generic error if Prisma throws generic error", async () => {
    const sut = new DeleteUserRepository()

    jest.spyOn(prisma.transactions, "delete").mockRejectedValueOnce(new Error())

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow()
  })

  test("Should throw generic error if Prisma throws generic error", async () => {
    const sut = new DeleteUserRepository()

    jest
      .spyOn(prisma.transactions, "delete")
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", { code: "P2025" }),
      )

    const result = sut.execute(user.id)

    await expect(result).rejects.toThrow(new UserNotFoundError(user.id))
  })
})
