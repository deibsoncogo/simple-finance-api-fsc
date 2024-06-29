import { prisma } from "../../../prisma/prisma.js"

export class CreateTransactionRepository {
  async execute(data) {
    const transaction = await prisma.transactions.create({
      data,
    })

    return transaction
  }
}
