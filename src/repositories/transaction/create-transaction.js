import { prisma } from "../../../prisma/prisma.js"

export class CreateTransactionRepository {
  async execute(createTransactionParams) {
    const transaction = await prisma.transaction.create({
      data: createTransactionParams,
    })

    return transaction
  }
}
