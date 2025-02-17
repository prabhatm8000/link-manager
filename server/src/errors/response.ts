export class APIResponseError extends Error {
  public status: number;
  public success: boolean;
  constructor(message: string, status: number = 500, success: boolean = false) {
    super(message);
    this.status = status;
    this.success = success;
  }
}
