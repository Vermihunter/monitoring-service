export default class AppError extends Error {
  public statusCode: number;
  public status: "fail" | "error";
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    // Restore prototype chain (important in TS when extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);

    (Error as any).captureStackTrace?.(this, this.constructor);
  }
}
