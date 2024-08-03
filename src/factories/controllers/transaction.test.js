import {
  CreateTransactionController,
  UpdateTransactionController,
  GetTransactionsByUserIdController,
  DeleteTransactionController,
} from "../../controllers/index.js"
import {
  makeCreateTransactionController,
  makeUpdateTransactionController,
  makeGetTransactionsByUserIdController,
  makeDeleteTransactionController,
} from "./transaction.js"

describe("Transaction controller factories", () => {
  test("Should return a valid CreateTransactionController instance", async () => {
    expect(makeCreateTransactionController()).toBeInstanceOf(
      CreateTransactionController,
    )
  })

  test("Should return a valid UpdateTransactionController instance", async () => {
    expect(makeUpdateTransactionController()).toBeInstanceOf(
      UpdateTransactionController,
    )
  })

  test("Should return a valid GetTransactionsByUserIdController instance", async () => {
    expect(makeGetTransactionsByUserIdController()).toBeInstanceOf(
      GetTransactionsByUserIdController,
    )
  })

  test("Should return a valid DeleteTransactionController instance", async () => {
    expect(makeDeleteTransactionController()).toBeInstanceOf(
      DeleteTransactionController,
    )
  })
})
