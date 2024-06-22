import { postgresHelper } from "../../db/postgres/helper.js"

export class GetTransactionsByUserIdRepository {
  async execute(userId) {
    const transactions = await postgresHelper.query(
      "SELECT * FROM transactions WHERE user_id = $1",
      [userId],
    )

    return transactions
  }
}
