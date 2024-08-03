import {
  CreateUserController,
  DeleteUserController,
  GetUserBalanceController,
  GetUserByIdController,
  UpdateUserController,
} from "../../controllers/index.js"
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeGetUserBalanceController,
  makeGetUserByIdController,
  makeUpdateUserController,
} from "./user.js"

describe("User controller factories", () => {
  test("Should return a valid CreateUserController instance", async () => {
    expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
  })

  test("Should return a valid GetUserByIdController instance", async () => {
    expect(makeGetUserByIdController()).toBeInstanceOf(GetUserByIdController)
  })

  test("Should return a valid GetUserBalanceController instance", async () => {
    expect(makeGetUserBalanceController()).toBeInstanceOf(
      GetUserBalanceController,
    )
  })

  test("Should return a valid UpdateUserController instance", async () => {
    expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
  })

  test("Should return a valid DeleteUserController instance", async () => {
    expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
  })
})
