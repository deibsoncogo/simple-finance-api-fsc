import { user as userFake } from "../../tests/index.js"
import { GetUserBalanceRepository } from "./get-user-balance.js"
import { prisma } from "../../../prisma/prisma.js"
import { TransactionType } from "@prisma/client"

describe("Get user balance repository", () => {
  test("Should get user balance on data base", async () => {
    const user = await prisma.users.create({ data: userFake })

    await prisma.transactions.createMany({
      data: [
        {
          name: "ea1",
          date: "2024-07-22T22:07:35.000Z",
          amount: 5000,
          userId: user.id,
          type: "earning",
        },
        {
          name: "ea2",
          date: "2024-07-23T22:07:35.000Z",
          amount: 5000,
          userId: user.id,
          type: "earning",
        },
        {
          name: "ex1",
          date: "2024-07-24T22:07:35.000Z",
          amount: 1000,
          userId: user.id,
          type: "expense",
        },
        {
          name: "ex2",
          date: "2024-07-24T22:07:35.000Z",
          amount: 1000,
          userId: user.id,
          type: "expense",
        },
        {
          name: "in1",
          date: "2024-07-26T22:07:35.000Z",
          amount: 3000,
          userId: user.id,
          type: "investment",
        },
        {
          name: "in2",
          date: "2024-07-25T22:07:35.000Z",
          amount: 3000,
          userId: user.id,
          type: "investment",
        },
      ],
    })

    const sut = new GetUserBalanceRepository()

    const result = await sut.execute(user.id)

    expect(result.totalEarnings.toString()).toBe("10000")
    expect(result.totalExpenses.toString()).toBe("2000")
    expect(result.totalInvestments.toString()).toBe("6000")
    expect(result.balance.toString()).toBe("2000")
  })

  test("Should call Prisma with correct params", async () => {
    const sut = new GetUserBalanceRepository()

    const executeSpy = jest.spyOn(prisma.transactions, "aggregate")

    await sut.execute(userFake.id)

    expect(executeSpy).toHaveBeenCalledTimes(3)

    expect(executeSpy).toHaveBeenCalledWith({
      where: { userId: userFake.id, type: TransactionType.expense },
      _sum: { amount: true },
    })

    expect(executeSpy).toHaveBeenCalledWith({
      where: { userId: userFake.id, type: TransactionType.earning },
      _sum: { amount: true },
    })

    expect(executeSpy).toHaveBeenCalledWith({
      where: { userId: userFake.id, type: TransactionType.investment },
      _sum: { amount: true },
    })
  })

  test("Should throw if Prisma throws", async () => {
    const sut = new GetUserBalanceRepository()

    jest
      .spyOn(prisma.transactions, "aggregate")
      .mockRejectedValueOnce(new Error())

    const result = sut.execute(userFake.id)

    await expect(result).rejects.toThrow()
  })
})
