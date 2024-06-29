import { prisma } from "../../../prisma/prisma.js"

export class GetUserByIdRepository {
  async execute(id) {
    const user = await prisma.users.findUnique({
      where: { id },
    })

    return user
  }
}
