import { faker } from "@faker-js/faker"
import { CreateTransactionController } from "./create-transaction.js"

describe("Create transaction controller", () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction
    }
  }

  const makeSut = () => {
    const createTransactionUseCaseStub = new CreateTransactionUseCaseStub()
    const createTransactionController = new CreateTransactionController(
      createTransactionUseCaseStub,
    )

    return { createTransactionUseCaseStub, createTransactionController }
  }

  const httpRequest = {
    body: {
      userId: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      type: "expense",
      amount: Number(faker.finance.amount()),
    },
  }

  test("Should return 201 when creating a transaction successfully (expense)", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(201)
  })

  test("Should return 201 when creating a transaction successfully (earning)", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, type: "earning" },
    })

    expect(result.statusCode).toBe(201)
  })

  test("Should return 201 when creating a transaction successfully (investment)", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, type: "investment" },
    })

    expect(result.statusCode).toBe(201)
  })

  test("Should return 400 when missing userId", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, userId: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when missing date", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, date: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when missing type", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, type: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when missing amount", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, amount: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when type is not EXPENSE, EARNING or INVESTMENT", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, type: "invalid" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when amount is not a valid currency", async () => {
    const { createTransactionController } = makeSut()

    const result = await createTransactionController.handle({
      body: { ...httpRequest.body, amount: "invalid" },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 500 when createTransactionUseCaseStub throws", async () => {
    const { createTransactionUseCaseStub, createTransactionController } =
      makeSut()

    jest
      .spyOn(createTransactionUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await createTransactionController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call createTransactionUseCaseStub with correct params", async () => {
    const { createTransactionUseCaseStub, createTransactionController } =
      makeSut()

    const executeSpy = jest.spyOn(createTransactionUseCaseStub, "execute")

    await createTransactionController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
