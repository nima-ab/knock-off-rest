import { RequestHandler } from "./handler";
import util from "util";
import { match } from "path-to-regexp";
import { Method } from "../constants";
import { Request, Response } from "../server";
import { QueryParser } from "../parsers/parser";
import {
  InvalidMethodError,
  NotFoundError,
  NotImplementedError,
  UndefinedRefrenceError,
} from "../error";

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

    throw new NotFoundError(`No router found for ${path}`);
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

    throw new NotFoundError(`No router found for ${req.request.url}`);
  }
}
class SingleRouterWrapper implements IRouterWrapper {
  router?: IRouter;
  path?: string;
  constructor() {}
  set(path: string, router: IRouter): void {
    throw new NotImplementedError();
  }
  route(req: Request, res: Response): void {
    throw new NotImplementedError();
  }

  get(path: string): IRouter {
    throw new NotImplementedError();
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

    if (!this.handlers.has(path)) throw new UndefinedRefrenceError("path");
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
  }
  route(req: Request, res: Response): void {
    const method = req.request.method?.toLowerCase() as Method;
    const split = req.request.url!.split("?");
    const path = split[0].substring(this.path!.length, split[0].length);
    const query = split[1];
    let count = 0;
    for (const handler of this.handlers) {
      let matchStr = match(handler.path, { decode: decodeURIComponent });
      let parsed = matchStr(path);
      if (!parsed) continue;
      count++;
      if (method !== handler.method) {
        if (count === this.handlers.length)
          throw new InvalidMethodError(method, req.request.url!);
        continue;
      }

      req.params = parsed.params;
      if (query) {
        req.query = new QueryParser().parse(query);
        req.querystr = query;
      }
      return handler.handle(req, res);
    }

    throw new NotFoundError(`No handler found for ${path}`);
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
