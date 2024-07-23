import { Prisma, TransactionType } from "@prisma/client"
import { prisma } from "../../../prisma/prisma.js"

export class GetUserBalanceRepository {
  async execute(userId) {
    const {
      _sum: { amount: totalExpenses },
    } = await prisma.transactions.aggregate({
      where: { userId, type: TransactionType.expense },
      _sum: { amount: true },
    })

    const {
      _sum: { amount: totalEarnings },
    } = await prisma.transactions.aggregate({
      where: { userId, type: TransactionType.earning },
      _sum: { amount: true },
    })

    const {
      _sum: { amount: totalInvestments },
    } = await prisma.transactions.aggregate({
      where: { userId, type: TransactionType.investment },
      _sum: { amount: true },
    })

    const _totalEarnings = totalEarnings || new Prisma.Decimal(0)
    const _totalExpenses = totalExpenses || new Prisma.Decimal(0)
    const _totalInvestments = totalInvestments || new Prisma.Decimal(0)

    const balance = new Prisma.Decimal(
      _totalEarnings - _totalExpenses - _totalInvestments,
    )

    return {
      totalEarnings: _totalEarnings,
      totalExpenses: _totalExpenses,
      totalInvestments: _totalInvestments,
      balance,
    }
  }
}
