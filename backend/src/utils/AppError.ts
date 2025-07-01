const enum AppErrorCode {
  InvalidAccessToken = "InvalidAccessToken",
}
class AppError extends Error {
  statusCode;
  message;
  errorCode;

  constructor(statusCode: number, message: string, errorCode?: AppErrorCode) {
    super(message); // Call parent constructor
    this.statusCode = statusCode; // Assign to instance property
    this.message = message; // Assign to instance property
    this.errorCode = errorCode; // Assign to instance property
  }
}

export default AppError;
