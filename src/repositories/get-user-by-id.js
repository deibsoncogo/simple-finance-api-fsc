import { postgresHelper } from "../db/postgres/helper.js"

export class GetUserByIdRepository {
  async execute(userId) {
    const user = await postgresHelper.query(
      "SELECT * FROM users WHERE id = $1",
      [userId],
    )

    return user[0]
  }
}
