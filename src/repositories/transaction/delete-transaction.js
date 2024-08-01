import { TransactionNotFoundError } from "../../errors/index.js"
import { prisma } from "../../../prisma/prisma.js"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export class DeleteTransactionRepository {
  async execute(id) {
    try {
      const transaction = await prisma.transactions.delete({
        where: { id },
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
