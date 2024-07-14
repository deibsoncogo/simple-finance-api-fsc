import { EmailAlreadyInUseError } from "../../errors/user.js"

export class UpdateUserUseCase {
  constructor(
    passwordHashAdapter,
    getUserByEmailRepository,
    updateUserRepository,
  ) {
    this.passwordHashAdapter = passwordHashAdapter
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
  }

  async execute(userId, updateUserParams) {
    if (updateUserParams.email) {
      const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
        updateUserParams.email,
      )

      if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
        throw new EmailAlreadyInUseError(updateUserParams.email)
      }
    }

    const user = { ...updateUserParams }

    if (updateUserParams.password) {
      const hashedPassword = await this.passwordHashAdapter.execute(
        updateUserParams.password,
      )

      user.password = hashedPassword
    }

    const updateUser = await this.updateUserRepository.execute(userId, user)

    return updateUser
  }
}
