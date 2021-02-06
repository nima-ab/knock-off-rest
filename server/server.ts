import http from "http";
import { ErrorHandling } from "../error";
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
  errorHandler: ErrorHandling.IErrorHandler;
  requestInterceptors: RequestHandler[];
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

    this.requestInterceptors = [];

    // this.fileServer = fileServer ? fileServer : undefined;
    // if (this.fileServer) this.fileServer.router = this.routerWrapper;
  }

  listen(port: number, onConnection?: () => void) {
    const server = http.createServer(async (req, res) => {
      const request = new Request(req);
      const response = new Response(res);
      try {
        // for (const interceptor of this.requestInterceptors) {
        //   await interceptor.handle(request, response);
        // }

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

  setRequestInterceptor(requestHandler: RequestHandler) {
    this.requestInterceptors.push(requestHandler);
  }
  // setErrorHandler(errorHandler: ErrorHandling.IErrorHandler) {
  //   this.errorHandler = errorHandler;
  // }
}
