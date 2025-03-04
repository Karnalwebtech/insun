class ErrorHandler extends Error {
  statusCode: number;
  path?: string; // Optional property for MongoDB CastError
  code?: number; // Optional property for MongoDB Duplicate Key Error
  keyValue?: Record<string, unknown>; // Optional for Duplicate Key errors

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Capture the stack trace and omit the constructor from it
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ErrorHandler;