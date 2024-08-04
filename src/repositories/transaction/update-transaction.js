import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { prisma } from "../../../prisma/prisma.js"
import { TransactionNotFoundError } from "../../errors/transaction.js"

export class UpdateTransactionRepository {
  async execute(id, data) {
    try {
      const transaction = await prisma.transactions.update({
        where: { id },
        data,
      })

      return transaction
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new TransactionNotFoundError(id)
        }
      }

      throw error
    }
  }
}
