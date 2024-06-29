import { prisma } from "../../../prisma/prisma.js"

export class GetTransactionsByUserIdRepository {
  async execute(userId) {
    const transactions = await prisma.transactions.findMany({
      where: { userId },
    })

    return transactions
  }
}
