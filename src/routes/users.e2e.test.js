import { faker } from "@faker-js/faker"
import { TransactionType } from "@prisma/client"
import supertest from "supertest"
import { app } from "../app.cjs"
import { transactionPartial, userPartial } from "../tests/index.js"

describe("Users router E2E", () => {
  test("POST /api/users should return 201 when user is created", async () => {
    const result = await supertest(app).post("/api/users").send(userPartial)

    expect(result.status).toBe(201)
  })

  test("POST /api/users should return 400 when the provided e-mail i already in use", async () => {
    await supertest(app).post("/api/users").send(userPartial)

    const result = await supertest(app).post("/api/users").send(userPartial)

    expect(result.status).toBe(400)
  })

  test("GET /api/users/:userId should return 200 when user is found", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    const result = await supertest(app).get(`/api/users/${user.id}`)

    expect(result.status).toBe(200)
    expect(result.body.id).toBe(user.id)
  })

  test("GET /api/users/:userId should return 404 when user is not found", async () => {
    const result = await supertest(app).get(`/api/users/${faker.string.uuid()}`)

    expect(result.status).toBe(404)
  })

  test("GET /api/users/:userId/balance should return 200 and correct balance", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    await supertest(app)
      .post("/api/transactions")
      .send({
        ...transactionPartial,
        userId: user.id,
        type: TransactionType.earning,
        amount: 5000,
      })

    await supertest(app)
      .post("/api/transactions")
      .send({
        ...transactionPartial,
        userId: user.id,
        type: TransactionType.expense,
        amount: 3500,
      })

    await supertest(app)
      .post("/api/transactions")
      .send({
        ...transactionPartial,
        userId: user.id,
        type: TransactionType.investment,
        amount: 1000,
      })

    const result = await supertest(app).get(`/api/users/${user.id}/balance`)

    expect(result.status).toBe(200)
    expect(result.body.totalEarnings).toBe("5000")
    expect(result.body.totalExpenses).toBe("3500")
    expect(result.body.totalInvestments).toBe("1000")
    expect(result.body.balance).toBe("500")
  })

  test("GET /api/users/:userId/balance should return 404 when user is not found", async () => {
    const result = await supertest(app).get(
      `/api/users/${faker.string.uuid()}/balance`,
    )

    expect(result.status).toBe(404)
  })

  test("PATCH /api/users/:userId should return 200 when user is updated", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    const result = await supertest(app)
      .patch(`/api/users/${user.id}`)
      .send(userPartial)

    expect(result.status).toBe(200)
    expect(result.body.firstName).toBe(userPartial.firstName)
    expect(result.body.lastName).toBe(userPartial.lastName)
    expect(result.body.email).toBe(userPartial.email)
    expect(result.body.password).not.toBe(userPartial.password)
  })

  test("PATCH /api/users/:userId should return 404 when user is not found", async () => {
    const result = await supertest(app)
      .patch(`/api/users/${faker.string.uuid()}`)
      .send(userPartial)

    expect(result.status).toBe(404)
  })

  test("DELETE /api/users/:userId should return 200 when user is deleted", async () => {
    const { body: user } = await supertest(app)
      .post("/api/users")
      .send(userPartial)

    const result = await supertest(app).delete(`/api/users/${user.id}`)

    expect(result.status).toBe(200)
    expect(result.body.id).toBe(user.id)
  })
})
