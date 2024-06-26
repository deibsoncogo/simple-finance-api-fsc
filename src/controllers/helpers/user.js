import { badRequest, notFound } from "./http.js"

export const invalidPasswordResponse = () => {
  return badRequest({ message: "Password must be at least 6 characters" })
}

export const emailIsAlreadyInUseResponse = () => {
  return badRequest({ message: "Invalid e-mail, please provide a valid one" })
}

export const userNotFoundResponse = () => {
  return notFound({ message: "User not found" })
}
