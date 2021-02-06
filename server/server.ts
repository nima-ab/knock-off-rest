import http from "http";
import { Method } from "../constants";
import {
  IRouter,
  SimpleRouter,
  RequestHandler,
  Next,
  DefaultErrorHandler,
} from "../router/index";
import { Request, Response } from "./index";

export class Server {
  routers: Map<string, IRouter>;
  constructor() {
    this.routers = new Map<string, IRouter>();
    this.routers.set("/", new SimpleRouter());
  }

  listen(port: number, onConnection?: () => void) {
    const server = http.createServer((req, res) => {
      const routerPath = req.url?.substring(0, 1);
      const handlerPath = req.url?.substring(1, req.url?.length);
      const method = req.method?.toLowerCase() as Method;
      const handler = this.routers
        .get(routerPath!)
        ?.route(method.concat(handlerPath!));
      req.on("data", (data) => {
        handler?.handle(new Request(req, data), new Response(res));
      });

      req.on("error", (error) => {
        new DefaultErrorHandler().handle(error, req, res);
      });
    });

    if (onConnection) server.on("connection", onConnection);

    server.listen(port);
  }

  set(method: Method, path: string, handler: RequestHandler) {
    console.log(method.concat(path.substring(1, path.length)));
    this.routers
      .get(path.substring(0, 1))
      ?.set(method.concat(path.substring(1, path.length)), handler);
  }
}
