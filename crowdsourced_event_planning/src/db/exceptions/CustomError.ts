export default class CustomError extends Error {
  public status: number = 500

  constructor(message: string, status: number = 500) {
    super(message)
    this.status = status
  }
}
