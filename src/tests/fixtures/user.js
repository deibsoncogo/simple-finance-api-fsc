import { faker } from "@faker-js/faker"

export const userPartial = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 7 }),
}

export const user = {
  ...userPartial,
  id: faker.string.uuid(),
}
