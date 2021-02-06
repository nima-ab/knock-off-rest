import { Method } from "./constants";
import { ComplexRouter, RequestHandler } from "./router";
import { Server, Request, Response } from "./server";
const server = new Server();

class MyGreetHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("handled a request");
    console.log("request body: ", req.body);
    res.send(req.params.id);
  }
}
class MyGreetJsonHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("handled a request");
    console.log("request body: ", req.body);
    res.send({
      id: req.params.id,
    });
  }
}

const router = new ComplexRouter();

router.set(Method.GET, "/:id", new MyGreetHandler());
router.set(Method.GET, "/:id/json", new MyGreetJsonHandler());

server.use("/users", router);

server.listen(3001, () => console.log(`server is listening on port ${3001}`));
