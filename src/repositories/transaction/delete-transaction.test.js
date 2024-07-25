import {
  user as userData,
  transaction as transactionData,
} from "../../tests/index.js"
import { DeleteTransactionRepository } from "./delete-transaction.js"
import { prisma } from "../../../prisma/prisma.js"

describe("Delete transaction repository", () => {
  test("Should delete a transaction on data base", async () => {
    const user = await prisma.users.create({ data: userData })

    const transaction = await prisma.transactions.create({
      data: { ...transactionData, userId: user.id },
    })

    const sut = new DeleteTransactionRepository()

    const result = await sut.execute(transaction.id)

    expect(result.id).toBe(transaction.id)
  })

  test("Should call Prisma with correct params", async () => {
    const sut = new DeleteTransactionRepository()

    const executeSpy = jest.spyOn(prisma.transactions, "delete")

    await sut.execute(transactionData.id)

    expect(executeSpy).toHaveBeenCalledWith({
      where: { id: transactionData.id },
    })
  })
})
