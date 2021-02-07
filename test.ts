import { ComplexRouter } from "./router";
import { Server } from "./server";
import { StaticFileServer } from "./middlewares";
import { router as userRouter } from "./test/user-router";
import joi from "joi";

const serverfile = new StaticFileServer("./public")
const server = new Server(undefined, undefined, serverfile);


server.setRouter("/users", userRouter);

server.listen(3001, () => console.log(`server is listening on port ${3001}`));
