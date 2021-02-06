import http from "http";
import { DefaultErrorHandler, IErrorHandler } from "../error";
import { StaticFileServer } from "../middlewares";
import {
  IRouter,
  RequestHandler,
  IRouterWrapper,
  PatternMachingRouterWrapper,
} from "../router";
import { Request, Response } from "./index";

export class Server {
  routerWrapper: IRouterWrapper;
  errorHandler: IErrorHandler;
  staticFileServer?: StaticFileServer;
  constructor(
    routerWrapper?: IRouterWrapper,
    errorHandler?: IErrorHandler,
    staticFileServer?: StaticFileServer
  ) {
    this.routerWrapper = routerWrapper
      ? routerWrapper
      : new PatternMachingRouterWrapper();

    this.errorHandler = errorHandler ? errorHandler : new DefaultErrorHandler();

    this.staticFileServer = staticFileServer ? staticFileServer : undefined;
    if (this.staticFileServer)
      this.staticFileServer.router = this.routerWrapper;
  }

  listen(port: number, onConnection?: () => void) {
    const server = http.createServer(async (req, res) => {
      const request = new Request(req);
      const response = new Response(res);
      try {
        if (this.staticFileServer)
          await this.staticFileServer?.handle(request, response);

        if (!req.headers["content-type"]) {
          // we don't have content type so we can
          // assume no content has been sent
          // so don't add a data listener
          return this.routerWrapper.route(request, response);
        } else if (!req.headers["content-length"]) {
          // we have content type but there is no length
          // so don't add a data listerner
          return this.routerWrapper.route(request, response);
        }

        // if the headers for body is defined handle the request
        // when the body arives

        req.on("data", (data) => {
          try {
            request.rawData = data;
            this.routerWrapper.route(request, response);
          } catch (error) {
            this.errorHandler.handle(error, request, response);
          }
        });
      } catch (error) {
        this.errorHandler.handle(error, request, response);
      }

      req.on("error", (error) => {
        this.errorHandler.handle(error, request, response);
      });
    });

    if (onConnection) server.on("listening", onConnection);

    server.listen(port);
  }

  setRouter(path: string, router: IRouter) {
    this.routerWrapper.set(path, router);
  }
  setErrorHandler(errorHandler: IErrorHandler) {
    this.errorHandler = errorHandler;
  }
}
