import { prisma } from "../../../prisma/prisma.js"

export class CreateUserRepository {
  async execute(createUserParams) {
    const user = await prisma.user.create({
      data: createUserParams,
    })

    return user
  }
}
