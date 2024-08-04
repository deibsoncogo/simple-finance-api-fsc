import { faker } from "@faker-js/faker"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { prisma } from "../../../prisma/prisma.js"
import { TransactionNotFoundError } from "../../errors/transaction.js"
import {
  transaction as transactionData,
  user as userData,
} from "../../tests/index.js"
import { UpdateTransactionRepository } from "./update-transaction.js"

describe("Update transaction repository", () => {
  const transactionNew = {
    id: faker.string.uuid(),
    userId: userData.id,
    name: faker.commerce.productName(),
    date: faker.date.anytime().toISOString(),
    type: "expense",
    amount: Number(faker.finance.amount()),
  }

  test("Should update transaction on data base", async () => {
    const user = await prisma.users.create({ data: userData })

    const transaction = await prisma.transactions.create({
      data: { ...transactionData, userId: user.id },
    })

    const sut = new UpdateTransactionRepository()

    const result = await sut.execute(transaction.id, transactionNew)

    expect(result.name).toStrictEqual(transactionNew.name)
  })

  test("should call Prisma with correct params", async () => {
    const user = await prisma.users.create({ data: userData })

    const transaction = await prisma.transactions.create({
      data: { ...transactionData, userId: user.id },
    })

    const sut = new UpdateTransactionRepository()

    const prismaSpy = jest.spyOn(prisma.transactions, "update")

    await sut.execute(transactionData.id, transactionNew)

    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: transaction.id },
      data: transactionNew,
    })
  })

  test("Should throw if Prisma throws", async () => {
    const sut = new UpdateTransactionRepository()

    jest.spyOn(prisma.transactions, "update").mockRejectedValueOnce(new Error())

    const result = sut.execute(transactionData.id, transactionNew)

    await expect(result).rejects.toThrow()
  })

  test("Should throw TransactionNotFoundError if Prisma does not find record to update", async () => {
    const sut = new UpdateTransactionRepository()

    jest
      .spyOn(prisma.transactions, "update")
      .mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", { code: "P2025" }),
      )

    const result = sut.execute(transactionData.id)

    await expect(result).rejects.toThrow(
      new TransactionNotFoundError(transactionData.id),
    )
  })
})
