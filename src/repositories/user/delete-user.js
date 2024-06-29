import { prisma } from "../../../prisma/prisma.js"

export class DeleteUserRepository {
  async execute(id) {
    try {
      const user = await prisma.users.delete({
        where: { id },
      })

      return user
    } catch (error) {
      return null
    }
  }
}
