import { IdGeneratorAdapter } from "./id-generator.js"

describe("Id generator adapter", () => {
  test("Should return a random id", async () => {
    const sut = new IdGeneratorAdapter()

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    const result = await sut.execute()

    expect(result).toBeTruthy()
    expect(typeof result).toBe("string")
    expect(result).toMatch(uuidRegex)
  })
})
