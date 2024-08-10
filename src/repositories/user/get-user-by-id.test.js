import { prisma } from "../../../prisma/prisma.js"
import { user as userFaker } from "../../tests/index.js"
import { GetUserByIdRepository } from "./get-user-by-id.js"

describe("Get user by id repository", () => {
  test("Should get user by id on data base", async () => {
    const user = await prisma.users.create({ data: userFaker })

    const sut = new GetUserByIdRepository()

    const result = await sut.execute(user.id)

    expect(result).toStrictEqual(user)
  })

  test("Should call Prisma with correct params", async () => {
    const sut = new GetUserByIdRepository()

    const executeSpy = import.meta.jest.spyOn(prisma.users, "findUnique")

    await sut.execute(userFaker.id)

    expect(executeSpy).toHaveBeenCalledWith({
      where: { id: userFaker.id },
    })
  })

  test("Should throw if Prisma throws", async () => {
    const sut = new GetUserByIdRepository()

    import.meta.jest
      .spyOn(prisma.users, "findUnique")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(userFaker.id)

    await expect(result).rejects.toThrow()
  })
})
