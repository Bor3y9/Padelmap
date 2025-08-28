export class ValidationError extends Error {
  public statusCode: number;
  public errors: Array<{ message: string; field?: string }>;

  constructor(
    message: string,
    errors?: Array<{ message: string; field?: string }>
  ) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
    this.errors = errors || [{ message }];
  }
}

export class DuplicateFieldError extends Error {
  public statusCode: number;
  public errors: Array<{ message: string; field?: string }>;

  constructor(message: string, field?: string) {
    super(message);
    this.name = "DuplicateFieldError";
    this.statusCode = 409; // Conflict
    this.errors = [{ message, field }];
  }
}

export class NotFoundError extends Error {
  public statusCode: number;
  public errors: Array<{ message: string }>;

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.errors = [{ message }];
  }
}

export class AuthenticationError extends Error {
  public statusCode: number;
  public errors: Array<{ message: string }>;

  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
    this.errors = [{ message }];
  }
}
