import {
  user as userData,
  transaction as transactionData,
} from "../../tests/index.js"
import { GetTransactionsByUserIdRepository } from "./get-transactions-by-user-id.js"
import { prisma } from "../../../prisma/prisma.js"

describe("Get transactions by UserId repository", () => {
  test("Should get transactions by userId on data base", async () => {
    const user = await prisma.users.create({ data: userData })

    const transaction = await prisma.transactions.create({
      data: { ...transactionData, userId: user.id },
    })

    const sut = new GetTransactionsByUserIdRepository()

    const result = await sut.execute(user.id)

    expect(result[0].name).toBe(transaction.name)
  })

  test("Should call Prisma with correct params", async () => {
    const sut = new GetTransactionsByUserIdRepository()

    const executeSpy = import.meta.jest.spyOn(prisma.transactions, "findMany")

    await sut.execute(userData.id)

    expect(executeSpy).toHaveBeenCalledWith({
      where: { userId: userData.id },
    })
  })

  test("Should throw if Prisma throws", async () => {
    const sut = new GetTransactionsByUserIdRepository()

    import.meta.jest
      .spyOn(prisma.transactions, "findMany")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(userData.id)

    expect(result).rejects.toThrow()
  })
})
