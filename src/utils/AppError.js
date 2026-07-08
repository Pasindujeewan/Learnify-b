export class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    // Machine-readable code lets the frontend show consistent toast messages.
    this.statusCode = statusCode;
    this.code = code;
  }
}
