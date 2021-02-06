import { ComplexRouter } from "./router";
import { Server } from "./server";
import joi from "joi";

const server = new Server();

import { router as userRouter } from "./test/user-router";

server.setRouter("/users", userRouter);

server.listen(3001, () => console.log(`server is listening on port ${3001}`));
