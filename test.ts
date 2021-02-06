import { Method } from "./constants";
import { RequestHandler } from "./router";
import { Server, Request, Response } from "./server";
const server = new Server();

class MyGreetHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("handled a request");
    console.log("request body: ", req.body);
    res.send("helllo");
  }
}
class MyGreetJsonHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    console.log("handled a request");
    console.log("request body: ", req.body);
    res.send({
      message: "hello",
    });
  }
}

const greet = new MyGreetHandler();
const greetJson = new MyGreetJsonHandler();

server.set(Method.GET, "/greet", greet);
server.set(Method.GET, "/greet/json", greetJson);

server.listen(3001);
