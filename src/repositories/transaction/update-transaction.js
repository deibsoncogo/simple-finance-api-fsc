import { prisma } from "../../../prisma/prisma.js"

export class UpdateTransactionRepository {
  async execute(id, data) {
    const transaction = await prisma.transactions.update({
      where: { id },
      data,
    })

    return transaction
  }
}
