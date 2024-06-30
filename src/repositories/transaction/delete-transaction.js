import { prisma } from "../../../prisma/prisma.js"

export class DeleteTransactionRepository {
  async execute(id) {
    try {
      const transaction = await prisma.transactions.delete({
        where: { id },
      })

      return transaction
    } catch (error) {
      return null
    }
  }
}
