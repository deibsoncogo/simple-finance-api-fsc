import { userPartial as user } from "../../tests/index.js"
import { CreateUserRepository } from "./create-user.js"

describe("Create user repository", () => {
  test("Should create a user on data base", async () => {
    const sut = new CreateUserRepository()

    const result = await sut.execute(user)

    expect(result).not.toBeNull()
  })
})
