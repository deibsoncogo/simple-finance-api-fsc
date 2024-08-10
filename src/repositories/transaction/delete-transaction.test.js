import {
  user as userData,
  transaction as transactionData,
} from "../../tests/index.js"
import { DeleteTransactionRepository } from "./delete-transaction.js"
import { prisma } from "../../../prisma/prisma.js"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { TransactionNotFoundError } from "../../errors/transaction.js"

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
    await prisma.users.create({ data: userData })

    await prisma.transactions.create({
      data: { ...transactionData, userId: userData.id },
    })

    const sut = new DeleteTransactionRepository()

    const executeSpy = import.meta.jest.spyOn(prisma.transactions, "delete")

    await sut.execute(transactionData.id)

    expect(executeSpy).toHaveBeenCalledWith({
      where: { id: transactionData.id },
    })
  })

  test("Should throw generic error if Prisma throws generic error", async () => {
    const sut = new DeleteTransactionRepository()

    import.meta.jest
      .spyOn(prisma.transactions, "delete")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(transactionData.id)

    await expect(result).rejects.toThrow()
  })

  test("Should throw generic error if Prisma throws generic error", async () => {
    const sut = new DeleteTransactionRepository()

    import.meta.jest
      .spyOn(prisma.transactions, "delete")
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", { code: "P2025" }),
      )

    const result = sut.execute(transactionData.id)

    await expect(result).rejects.toThrow(
      new TransactionNotFoundError(transactionData.id),
    )
  })
})
