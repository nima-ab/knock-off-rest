import { Method } from "./constants";
import { StaticFileServer } from "./middlewares";
import { ComplexRouter, RequestHandler } from "./router";
import { Server, Request, Response } from "./server";
import path from "path";
import joi from "joi";
import { ValidationHandler } from "./middlewares/validation-handler";

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
    console.log("MyGreetJsonHandler: ", req.body);
    res.send({
      id: req.params.id,
    });

    this.next(req, res);
  }
}
class MyHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("MyHandler: ", req.body);
    this.next(req, res);
  }
}

const schema = joi.object({
  name: joi.string(),
  password: joi.string().required(),
});

const groupRouter = new ComplexRouter();

// show how the builder works and why it is that way
// const handler = RequestHandler.builder(new ValidationHandler(schema))
//   .set(new MyGreetHandler())
//   .build();

// console.log(typeof handler);

import { router as userRouter } from "./test/user-router";

server.setRouter("/users", userRouter);

server.listen(3001, () => console.log(`server is listening on port ${3001}`));
