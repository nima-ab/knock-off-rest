import { Request, Response } from "../server";
import { Errors } from "./error";

export namespace ErrorHandling {
  export interface IErrorHandler {
    handle: (error: Error, req: Request, res: Response) => void;
  }

  export class DefaultErrorHandler implements IErrorHandler {
    handle(error: Error, req: Request, res: Response): void {
      if (error instanceof Errors.HttpErrorBase) {
        res.response.statusCode = error.status;
        return res.send(error.toObject());
      }

      console.log(error.message);
      res.response.statusCode = 400;
      res.send({
        message: "an unhandled error occurred",
      });
    }
  }
}
