import { faker } from "@faker-js/faker"
import { prisma } from "../../../prisma/prisma.js"
import { user as userFaker } from "../../tests/index.js"
import { UpdateUserRepository } from "./update-user.js"

describe("Update user repository", () => {
  const userNew = {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }

  test("Should update user on data base", async () => {
    const user = await prisma.users.create({ data: userFaker })

    const sut = new UpdateUserRepository()

    const result = await sut.execute(user.id, userNew)

    expect(result).toStrictEqual({ id: user.id, ...userNew })
  })

  it("should call Prisma with correct params", async () => {
    const user = await prisma.users.create({ data: userFaker })

    const sut = new UpdateUserRepository()

    const prismaSpy = jest.spyOn(prisma.users, "update")

    await sut.execute(user.id, userNew)

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: user.id },
      data: userNew,
    })
  })

  test("Should throw if Prisma throws", async () => {
    const sut = new UpdateUserRepository()

    jest.spyOn(prisma.users, "update").mockRejectedValueOnce(new Error())

    const result = sut.execute(userNew)

    await expect(result).rejects.toThrow()
  })
})
