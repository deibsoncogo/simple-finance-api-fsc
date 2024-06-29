import { prisma } from "../../../prisma/prisma.js"

export class GetUserByIdRepository {
  async execute(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    return user
  }
}
