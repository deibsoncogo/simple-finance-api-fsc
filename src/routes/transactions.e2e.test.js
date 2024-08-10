import { faker } from "@faker-js/faker"
import supertest from "supertest"
import { transactionPartial, userPartial } from "../tests/index.js"
import { app } from "../app.js"

describe("Transactions router E2E", () => {
  test("POST /api/transactions should return 201 when transaction is created", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    const result = await supertest(app)
      .post("/api/transactions")
      .send({ ...transactionPartial, userId: user.id })

    expect(result.status).toBe(201)
  })

  test("GET /api/transactions?userId should return 200 when transaction is found", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    const { body: transaction } = await supertest(app)
      .post("/api/transactions")
      .send({ ...transactionPartial, userId: user.id })

    const result = await supertest(app).get(
      `/api/transactions?userId=${user.id}`,
    )

    expect(result.status).toBe(200)
    expect(result.body[0].id).toBe(transaction.id)
  })

  test("GET /api/transactions/:userId should return 404 when transaction is not found", async () => {
    const result = await supertest(app).get(
      `/api/transactions?userId=${faker.string.uuid()}`,
    )

    expect(result.status).toBe(404)
  })

  test("PATCH /api/transactions/:transactionId should return 200 when transaction is updated", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    const { body: transaction } = await supertest(app)
      .post("/api/transactions")
      .send({ ...transactionPartial, userId: user.id })

    const result = await supertest(app)
      .patch(`/api/transactions/${transaction.id}`)
      .send({ amount: 100 })

    expect(result.status).toBe(200)
    expect(result.body.amount).toBe("100")
  })

  test("PATCH /api/transactions/:transactionId should return 404 when transaction is not found", async () => {
    const result = await supertest(app)
      .patch(`/api/transactions/${faker.string.uuid()}`)
      .send({ amount: 100 })

    expect(result.status).toBe(404)
  })

  test("DELETE /api/transactions/:transactionId should return 200 when transaction is deleted", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    const { body: transaction } = await supertest(app)
      .post("/api/transactions")
      .send({ ...transactionPartial, userId: user.id })

    const result = await supertest(app).delete(
      `/api/transactions/${transaction.id}`,
    )

    expect(result.status).toBe(200)
    expect(result.body.id).toBe(transaction.id)
  })

  test("DELETE /api/transactions/:transactionId should return 404 when transaction is not found", async () => {
    const result = await supertest(app).delete(
      `/api/transactions/${faker.string.uuid()}`,
    )

    expect(result.status).toBe(404)
  })
})
