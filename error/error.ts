import { Method } from "../constants";
import { ValidationError as JoiValidationError } from "joi";

export class NotImplementedError extends Error {
  constructor() {
    super("Not Implemented!");
  }
}
export class UndefinedRefrenceError extends Error {
  constructor(name: string) {
    super(`${name} is not defined!`);
  }
}

export abstract class HttpErrorBase extends Error {
  abstract status: number;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, HttpErrorBase.prototype);
  }

  toObject(): { message: string; fields?: [string] } {
    return {
      message: this.message,
    };
  }
}

export class ValidationError extends HttpErrorBase {
  status = 400;
  validationError: JoiValidationError;
  constructor(public error: JoiValidationError) {
    super("");
    this.validationError = error;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  toObject() {
    let d = this.validationError.details[0];
    return {
      message: d.message || this.validationError.message,
      fields: d.context?.key ? [d.context?.key] : d.context?.peers,
    };
  }
}

export class NotFoundError extends HttpErrorBase {
  status = 404;
  constructor(message?: string) {
    super(message ? message : "Resource not found!");

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
export class InternalServerError extends HttpErrorBase {
  status = 500;
  constructor() {
    super("Internal server error!");

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
export class InvalidMethodError extends HttpErrorBase {
  status = 404;
  constructor(method: Method, path: string) {
    super(`Cannot ${method} ${path}`);

    Object.setPrototypeOf(this, InvalidMethodError.prototype);
  }
}
export class ResouceConflict extends HttpErrorBase {
  status = 409;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ResouceConflict.prototype);
  }
}
export class BadRequestError extends HttpErrorBase {
  status = 400;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
export class ParseError extends BadRequestError {
  constructor(type: string) {
    super(`Failed in parsing ${type}`);

    Object.setPrototypeOf(this, ParseError.prototype);
  }
}
export class SerializeError extends BadRequestError {
  constructor(type: string) {
    super(`Failed in serializing ${type}`);

    Object.setPrototypeOf(this, SerializeError.prototype);
  }
}
