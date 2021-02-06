import { RequestHandler } from "./handler";
import util from "util";
import { match } from "path-to-regexp";
import { Method } from "../constants";
import { Request, Response } from "../server";
import { QueryParser } from "../parsers/parser";

interface IRouter {
  path?: string;
  set: (method: Method, path: string, handler: RequestHandler) => void;
  route: (req: Request, res: Response) => void;
}

interface IRouterWrapper {
  path?: string;
  set: (path: string, router: IRouter) => void;
  route: (req: Request, res: Response) => void;
  get: (path: string) => IRouter;
}

class PatternMachingRouterWrapper implements IRouterWrapper {
  private _routers: IRouter[];
  path?: string;

  constructor() {
    this._routers = [];
  }

  get(path: string) {
    for (const router of this._routers) {
      if (router.path === path) return router;
    }

    throw new Error("Not Found");
  }

  set(path: string, router: IRouter): void {
    router.path = path;
    this._routers.push(router);
  }
  route(req: Request, res: Response): void {
    for (const router of this._routers) {
      let matchStr = match(router.path!, { decode: decodeURIComponent });
      let parsed = matchStr(
        req.request.url?.substring(0, router.path!.length)!
      );
      if (!parsed) continue;

      router.route(req, res);
      return;
    }

    throw new Error("Not Found");
  }
}
class SingleRouterWrapper implements IRouterWrapper {
  router?: IRouter;
  path?: string;
  constructor() {}
  set(path: string, router: IRouter): void {
    throw new Error("not implemented");
  }
  route(req: Request, res: Response): void {
    throw new Error("not implemented");
  }

  get(path: string): IRouter {
    throw new Error("not implemented");
  }
}

class SimpleRouter implements IRouter {
  private handlers: Map<string, RequestHandler>;

  constructor() {
    this.handlers = new Map();
  }

  set(method: Method, path: string, handler: RequestHandler): void {
    this.handlers.set(path, handler);
  }
  route(req: Request, res: Response): void {
    const path = req.request.url!;

    if (!this.handlers.has(path)) throw new Error("null");
    this.handlers.get(path)?.handle(req, res);
  }
}

class ComplexRouter implements IRouter {
  private _handlers: RequestHandler[];
  path?: string;

  constructor() {
    this._handlers = [];
  }

  get handlers() {
    return this._handlers;
  }

  set(method: Method, path: string, handler: RequestHandler): void {
    handler.method = method;
    handler.path = path;
    this.handlers.push(handler);
    console.log(this.handlers.length);
  }
  route(req: Request, res: Response): void {
    const method = req.request.method?.toLowerCase() as Method;
    const split = req.request.url!.split("?");
    const path = split[0].substring(this.path!.length, split[0].length);
    const query = split[1];
    for (const handler of this.handlers) {
      let matchStr = match(handler.path, { decode: decodeURIComponent });
      let parsed = matchStr(path);
      if (!parsed) continue;

      if (method !== handler.method)
        throw new Error(`Cannot ${method} ${this.path!.concat(path)}`);

      req.params = parsed.params;
      if (query) {
        req.query = new QueryParser();
        req.querystr = query;
      }
      return handler.handle(req, res);
    }

    throw new Error("Not Found");
  }
}

export {
  IRouter,
  SimpleRouter,
  IRouterWrapper,
  PatternMachingRouterWrapper,
  SingleRouterWrapper,
  ComplexRouter,
};

// const matcher = match("/users");
// const split = "/users?type=a&b=c".split("?");

// const path = split[0];
// const query = split[1];

// console.log(query);
// console.log(matcher(path));
