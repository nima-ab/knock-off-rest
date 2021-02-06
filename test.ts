import { Method } from "./constants";
import { StaticFileServer } from "./middlewares";
import { ComplexRouter, RequestHandler } from "./router";
import { Server, Request, Response } from "./server";
import path from "path";

const server = new Server();
server.setRequestInterceptor(
  new StaticFileServer(path.join(__dirname, "public"))
);

class MyGreetHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("handled a request");
    console.log("request body: ", req.body);
    res.send(req.params.id);
  }
}
class MyGreetJsonHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("MyGreetJsonHandler: ", req.body);
    res.send({
      id: req.params.id,
    });
  }
}
class MyHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("MyHandler: ", req.body);
    this.next(req, res);
  }
}

const router = new ComplexRouter();
const groupRouter = new ComplexRouter();

groupRouter.set(
  Method.POST,
  "/:id",
  RequestHandler.builder(new MyHandler()).set(new MyGreetHandler()).build()
);

router.set(Method.GET, "/:id", new MyGreetHandler());
router.set(Method.GET, "/:id/json", new MyGreetJsonHandler());

server.setRouter("/users", router);
server.setRouter("/groups", groupRouter);

server.listen(3001, () => console.log(`server is listening on port ${3001}`));
