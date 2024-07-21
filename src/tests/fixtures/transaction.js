import { faker } from "@faker-js/faker"
import { user } from "./user"

export const transactionPartial = {
  userId: user.id,
  name: faker.commerce.productName(),
  date: faker.date.anytime().toISOString(),
  type: "expense",
  amount: Number(faker.finance.amount()),
}

export const transaction = {
  ...transactionPartial,
  id: faker.string.uuid(),
}
