export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

const createError = (statusCode, defaultMessage) => (message = defaultMessage) =>
  new AppError(statusCode, message);

export const BadRequest = createError(400, "Bad request");
export const Unauthorized = createError(401, "Unauthorized");
export const Forbidden = createError(403, "Forbidden");
export const NotFound = createError(404, "Not found");
export const Conflict = createError(409, "Conflict");



