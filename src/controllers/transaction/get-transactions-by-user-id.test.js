import { transaction } from "../../tests/index.js"
import { GetTransactionsByUserIdController } from "./get-transactions-by-user-id.js"
import { UserNotFoundError } from "../../errors/user.js"

describe("Get transaction by user id controller", () => {
  const httpRequest = {
    query: { userId: transaction.userId },
  }

  class GetTransactionsByUserIdUseCaseStub {
    async execute(transactionId) {
      return {
        ...transaction,
        id: transactionId,
      }
    }
  }

  const makeSut = () => {
    const getTransactionsByUserIdUseCaseStub =
      new GetTransactionsByUserIdUseCaseStub()

    const getTransactionsByUserIdController =
      new GetTransactionsByUserIdController(getTransactionsByUserIdUseCaseStub)

    return {
      getTransactionsByUserIdUseCaseStub,
      getTransactionsByUserIdController,
    }
  }

  test("Should return 200 when finding transaction by user id successfully", async () => {
    const { getTransactionsByUserIdController } = makeSut()

    const result = await getTransactionsByUserIdController.handle(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  test("Should return 400 when missing userId query", async () => {
    const { getTransactionsByUserIdController } = makeSut()

    const result = await getTransactionsByUserIdController.handle({
      query: { userId: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  test("Should return 400 when userId param is invalid", async () => {
    const { getTransactionsByUserIdController } = makeSut()

    const response = await getTransactionsByUserIdController.handle({
      query: { userId: "invalid_user_id" },
    })

    expect(response.statusCode).toBe(400)
  })

  test("Should return 404 when user is not found", async () => {
    const {
      getTransactionsByUserIdUseCaseStub,
      getTransactionsByUserIdController,
    } = makeSut()

    jest
      .spyOn(getTransactionsByUserIdUseCaseStub, "execute")
      .mockRejectedValueOnce(new UserNotFoundError())

    const result = await getTransactionsByUserIdController.handle(httpRequest)

    expect(result.statusCode).toBe(404)
  })

  test("Should return 500 when getTransactionsByUserIdUseCaseStub throws generic error", async () => {
    const {
      getTransactionsByUserIdUseCaseStub,
      getTransactionsByUserIdController,
    } = makeSut()

    jest
      .spyOn(getTransactionsByUserIdUseCaseStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await getTransactionsByUserIdController.handle(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  test("Should call getTransactionsByUserIdUseCaseStub with correct params", async () => {
    const {
      getTransactionsByUserIdUseCaseStub,
      getTransactionsByUserIdController,
    } = makeSut()

    const executeSpy = jest.spyOn(getTransactionsByUserIdUseCaseStub, "execute")

    await getTransactionsByUserIdController.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId)
  })
})
