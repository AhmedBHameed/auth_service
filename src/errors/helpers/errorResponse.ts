interface ErrorData {
  errorCode: string;
  message: string;
  statusCode: number;
}

export class ErrorResponse {
  errorCode!: string;
  message!: string;
  statusCode!: number;

  constructor(errors: ErrorData) {
    this.errorCode = errors.errorCode;
    this.message = errors.message;
    this.statusCode = errors.statusCode;
  }
}
