import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { prisma } from "../../../prisma/prisma.js"
import { UserNotFoundError } from "../../errors/index.js"

export class DeleteUserRepository {
  async execute(id) {
    try {
      const user = await prisma.users.delete({
        where: { id },
      })

      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new UserNotFoundError(id)
        }
      }

      throw error
    }
  }
}
