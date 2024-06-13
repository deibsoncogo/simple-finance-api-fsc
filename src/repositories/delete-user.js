import { postgresHelper } from "../db/postgres/helper.js"

export class DeleteUserRepository {
  async execute(userId) {
    const deletedUser = await postgresHelper.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId],
    )

    return deletedUser[0]
  }
}
