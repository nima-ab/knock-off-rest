import { RequestHandler } from "../router";
import { Response, Request } from "../server";

abstract class InterceptorBase extends RequestHandler {
  abstract handle(req: Request, res: Response): void;
}
