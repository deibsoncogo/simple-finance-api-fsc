import { faker } from "@faker-js/faker"
import { PasswordHashAdapter } from "./password-hash.js"

describe("Password hash adapter", () => {
  test("Should return a hashed Password", async () => {
    const sut = new PasswordHashAdapter()

    const password = faker.internet.password({ length: 7 })

    const result = await sut.execute(password)

    expect(result).toBeTruthy()
    expect(typeof result).toBe("string")
    expect(result).not.toBe(password)
  })
})
