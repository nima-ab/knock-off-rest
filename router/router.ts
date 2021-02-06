import { RequestHandler } from "./handler";

interface IRouter {
  set: (path: string, handler: RequestHandler) => void;
  route: (path: string) => RequestHandler;
}

class SimpleRouter implements IRouter {
  private handlers: Map<string, RequestHandler>;

  constructor() {
    this.handlers = new Map();
  }

  set(path: string, handler: RequestHandler): void {
    // console.log("set", path);
    this.handlers.set(path, handler);
  }
  route(path: string): RequestHandler {
    // console.log("route", path);
    if (!this.handlers.has(path)) throw new Error("null");
    return this.handlers.get(path)!;
  }
}

export { IRouter, SimpleRouter };
