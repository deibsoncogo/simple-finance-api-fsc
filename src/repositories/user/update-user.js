import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { prisma } from "../../../prisma/prisma.js"
import { UserNotFoundError } from "../../errors/user.js"

export class UpdateUserRepository {
  async execute(id, data) {
    try {
      const user = await prisma.users.update({
        where: { id },
        data,
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
