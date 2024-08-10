import { prisma } from "../../../prisma/prisma.js"
import { user as userFake } from "../../tests/index.js"
import { GetUserByEmailRepository } from "./get-user-by-email.js"

describe("Get user by email repository", () => {
  test("Should get user by email on data base", async () => {
    const user = await prisma.users.create({ data: userFake })

    const sut = new GetUserByEmailRepository()

    const result = await sut.execute(user.email)

    expect(result).toStrictEqual(user)
  })

  test("Should call Prisma with correct params", async () => {
    const sut = new GetUserByEmailRepository()

    const executeSpy = import.meta.jest.spyOn(prisma.users, "findUnique")

    await sut.execute(userFake.email)

    expect(executeSpy).toHaveBeenCalledWith({
      where: { email: userFake.email },
    })
  })

  test("Should throw if Prisma throws", async () => {
    const sut = new GetUserByEmailRepository()

    import.meta.jest
      .spyOn(prisma.users, "findUnique")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(userFake.email)

    await expect(result).rejects.toThrow()
  })
})
