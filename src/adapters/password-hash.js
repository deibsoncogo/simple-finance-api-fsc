import bcrypt from "bcrypt"

export class PasswordHashAdapter {
  async execute(password) {
    return bcrypt.hash(password, 10)
  }
}
