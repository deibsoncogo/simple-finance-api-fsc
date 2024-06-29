import { prisma } from "../../../prisma/prisma.js"

export class UpdateTransactionRepository {
  async execute(transactionId, updateTransactionParams) {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateTransactionParams,
    })

    return transaction
  }
}
