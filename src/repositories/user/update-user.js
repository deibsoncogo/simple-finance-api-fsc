import { prisma } from "../../../prisma/prisma.js"

export class UpdateUserRepository {
  async execute(id, data) {
    const user = await prisma.users.update({
      where: { id },
      data,
    })

    return user
  }
}
