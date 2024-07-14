import validator from "validator"
import { badRequest } from "./http.js"

export const checkIfIdIsValid = (id) => {
  return validator.isUUID(id)
}

export const invalidIdResponse = () => {
  return badRequest({ message: "The provided id is not valid" })
}

export const requiredFieldIsMissingResponse = (field) => {
  return badRequest({ message: `The field ${field} is required` })
}
