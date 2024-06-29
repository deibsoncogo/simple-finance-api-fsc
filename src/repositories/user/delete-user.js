import { prisma } from "../../../prisma/prisma.js"

export class DeleteUserRepository {
  async execute(userId) {
    try {
      const user = await prisma.user.delete({
        where: { id: userId },
      })

      return user
    } catch (error) {
      return null
    }
  }
}
