import http from "http";

interface IErrorHandler {
  handle: (
    error: Error,
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => void;
}

class DefaultErrorHandler implements IErrorHandler {
  handle(
    error: Error,
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): void {
    res.statusCode = 500;
    res.end(error.message);
  }
}

export { IErrorHandler, DefaultErrorHandler };
