import { Method } from "./constants";
import { ValidationHandler } from "./middlewares/validation-handler";
import { ComplexRouter, RequestHandler } from "./router";
import { Server, Request, Response } from "./server";
import joi from 'joi';
const server = new Server();

class MyGreetHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("handled a request");
    console.log("request body: ", req.body);
    res.send(req.params.id);

    this.next(req, res);
  }
}
class MyGreetJsonHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("handled a request");
    console.log("request body: ", req.body);
    res.send({
      id: req.params.id,
    });

    this.next(req, res);
  }
}

const schema = joi.object({
  name: joi.string(),
  password: joi.string().required()
});

const router = new ComplexRouter();
const groupRouter = new ComplexRouter();

// show how the builder works and why it is that way
const handler =  RequestHandler.builder(new ValidationHandler(schema)).set(new MyGreetHandler()).build();

const bullshit = RequestHandler.builder(new MyGreetJsonHandler()).set(new MyGreetHandler()).build();

// console.log(typeof handler);

groupRouter.set(Method.POST, "/login", handler);
groupRouter.set(Method.POST, '/bullshit', bullshit);
router.set(Method.GET, "/:id", new MyGreetHandler());
router.set(Method.GET, "/:id/json", new MyGreetJsonHandler());

server.setRouter("/users", router);
server.setRouter("/groups", groupRouter);

server.listen(3001, () => console.log(`server is listening on port ${3001}`));
