import { ServerResponse } from "http";
import serveStatic, { ServeStaticOptions } from "serve-static";

import { IRouterWrapper, RequestHandler } from "../router";
import { Request, Response } from "../server";

export class StaticFileServer extends RequestHandler {
  private serve: serveStatic.RequestHandler<ServerResponse>;
  router?: IRouterWrapper;
  constructor(root: string, options?: ServeStaticOptions) {
    super();

    this.serve = serveStatic(root, options);
  }

  async handle(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serve(req.request, res.response, () => {
        resolve();
      });
    });
  }
}
