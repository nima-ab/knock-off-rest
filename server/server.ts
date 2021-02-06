import http from "http";
import { Method } from "../constants";
import { ErrorHandling } from "../error";
import {
  IRouter,
  SimpleRouter,
  RequestHandler,
  Next,
  IRouterWrapper,
  PatternMachingRouterWrapper,
  ComplexRouter,
} from "../router";
import { Request, Response } from "./index";

export class Server {
  routerWrapper: IRouterWrapper;
  errorHandler: ErrorHandling.IErrorHandler;
  constructor(
    routerWrapper?: IRouterWrapper,
    errorHandler?: ErrorHandling.IErrorHandler
  ) {
    this.routerWrapper = routerWrapper
      ? routerWrapper
      : new PatternMachingRouterWrapper();

    this.errorHandler = errorHandler
      ? errorHandler
      : new ErrorHandling.DefaultErrorHandler();
  }

  listen(port: number, onConnection?: () => void) {
    const server = http.createServer((req, res) => {
      const request = new Request(req);
      const response = new Response(res);
      try {
        if (!req.headers["content-encoding"]) {
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
          request.rawData = data;
          this.routerWrapper.route(request, response);
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
  setErrorHandler(errorHandler: ErrorHandling.IErrorHandler) {
    this.errorHandler = errorHandler;
  }
}
