import { prisma } from "../../../prisma/prisma.js"

export class CreateUserRepository {
  async execute(data) {
    const user = await prisma.users.create({
      data,
    })

    return user
  }
}
