import { postgresHelper } from "../../db/postgres/helper.js"

export class GetUserBalanceRepository {
  async execute(userId) {
    const balance = await postgresHelper.query(
      "SELECT * FROM get_user_balance($1)",
      [userId],
    )

    return { userId, ...balance[0] }
  }
}
