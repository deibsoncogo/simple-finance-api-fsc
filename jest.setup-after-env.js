import { prisma } from "./prisma/prisma.js"

beforeEach(async () => {
  await prisma.transactions.deleteMany({})
  await prisma.users.deleteMany({})
})
