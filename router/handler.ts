import { Method } from "../constants";
import { Errors } from "../error";
import { Request, Response } from "../server";

type Next = (req: Request, res: Response) => void;

abstract class RequestHandler {
  private nextHandler?: RequestHandler;
  protected next: Next;
  private _path?: string;
  private _method?: Method;

  constructor() {
    this.next = (req: Request, res: Response) => {
      if (!this.nextHandler)
        throw new Errors.UndefinedRefrenceError("nextHandler");
      return this.nextHandler.handle(req, res);
    };
  }

  get path() {
    if (!this._path) throw new Errors.UndefinedRefrenceError("path");
    return this._path;
  }
  set path(path: string) {
    this._path = path;
  }
  get method() {
    if (!this._method) throw new Errors.UndefinedRefrenceError("method");
    return this._method;
  }
  set method(method: Method) {
    this._method = method;
  }

  abstract handle(req: Request, res: Response): void;
  setNext(handler: RequestHandler): RequestHandler {
    this.nextHandler = handler;
    return handler;
  }
  static builder(handler: RequestHandler): HandlerBuilder {
    return new HandlerBuilder(handler);
  }
}

class HandlerBuilder {
  private handler: RequestHandler;
  private temp: RequestHandler;
  constructor(handler: RequestHandler) {
    this.handler = handler;
    this.temp = handler;
  }

  set(newHandler: RequestHandler): HandlerBuilder {
    this.temp = this.temp.setNext(newHandler);
    return this;
  }

  build(): RequestHandler {
    return this.handler;
  }
}

export { Next, RequestHandler };
