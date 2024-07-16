import { EmailAlreadyInUseError } from "../../errors/user.js"

export class CreateUserUseCase {
  constructor(
    idGeneratorAdapter,
    passwordHashAdapter,
    getUserByEmailRepository,
    createUserRepository,
  ) {
    this.idGeneratorAdapter = idGeneratorAdapter
    this.passwordHashAdapter = passwordHashAdapter
    this.getUserByEmailRepository = getUserByEmailRepository
    this.createUserRepository = createUserRepository
  }

  async execute(createUserParams) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      createUserParams.email,
    )

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(createUserParams.email)
    }

    const userId = await this.idGeneratorAdapter.execute()

    const hashedPassword = await this.passwordHashAdapter.execute(
      createUserParams.password,
    )

    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    const createUser = await this.createUserRepository.execute(user)

    return createUser
  }
}
