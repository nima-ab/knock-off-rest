import { Method } from "../constants";

export namespace Errors {
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

    toObject() {
      return {
        message: this.message,
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
}
