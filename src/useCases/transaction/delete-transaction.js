export class DeleteTransactionUseCase {
  constructor(deleteTransactionRepository) {
    this.deleteTransactionRepository = deleteTransactionRepository
  }

  async execute(id) {
    const transaction = await this.deleteTransactionRepository.execute(id)

    return transaction
  }
}
