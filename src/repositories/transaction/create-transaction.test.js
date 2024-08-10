import {
  user as userData,
  transaction as transactionData,
} from "../../tests/index.js"
import { CreateTransactionRepository } from "./create-transaction.js"
import { prisma } from "../../../prisma/prisma.js"

describe("Create transaction repository", () => {
  test("Should create a transaction on data base", async () => {
    const user = await prisma.users.create({ data: userData })

    const sut = new CreateTransactionRepository()

    const result = await sut.execute({ ...transactionData, userId: user.id })

    expect(result.id).toBe(transactionData.id)
  })

  test("should call Prisma with correct params", async () => {
    const user = await prisma.users.create({ data: userData })

    const sut = new CreateTransactionRepository()

    const prismaSpy = import.meta.jest.spyOn(prisma.transactions, "create")

    await sut.execute({ ...transactionData, userId: user.id })

    expect(prismaSpy).toHaveBeenCalledWith({
      data: { ...transactionData, userId: user.id },
    })
  })

  test("Should throw if Prisma throws", async () => {
    const sut = new CreateTransactionRepository()

    import.meta.jest
      .spyOn(prisma.transactions, "create")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute({ ...transactionData, userId: userData.id })

    await expect(result).rejects.toThrow()
  })
})
