import Joi from "joi";
import { join } from "path";
import { Method } from "../constants";
import { NotFoundError } from "../error";
import { ValidationHandler } from "../middlewares/validation-handler";
import { ComplexRouter, RequestHandler } from "../router";
import { Request, Response } from "../server";
import {User} from "../db";

const router = new ComplexRouter();
const users = [
  {
    id: "1",
    name: "sina",
    pass: "123456789",
    email: "example@gmail.com",
  },
  {
    id: "2",
    name: "nima",
    pass: "123456789",
    email: "example2@gmail.com",
  },
  {
    id: "3",
    name: "masood",
    pass: "123456789",
    email: "example3@gmail.com",
  },
  {
    id: "4",
    name: "sadeq",
    pass: "123456789",
    email: "example4@gmail.com",
  },
];

const userdb: User[] = []
for (const iterator of users) {
  userdb.push(new User(iterator.name, iterator.email, iterator.id))
}

class GetUserHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    let user = undefined;

    for (const u of userdb) {
      if (u.getProps("id") === req.params?.id) user = u;
    }

    if (!user)
      throw new NotFoundError("Didn't find any user with the given id!");

    res.send(user.toObject());
  }
}
class GetUsersHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    res.send([...userdb.map(u => u.toObject())]);
  }
}
const schema = Joi.object({
  name: Joi.string().required(),
  // pass: Joi.string().required().min(6).max(16),
  email: Joi.string().email(),
});

class SignupUserHandler extends RequestHandler {
  private id: number;
  constructor() {
    super();
    this.id = userdb.length;
  }
  handle(req: Request, res: Response): void {
    const user =new User(req.body.name, req.body.email, `${++this.id}`)
    userdb.push(user);

    res.status(201).send(user.toObject());
  }
}

router.set(Method.GET, "/", new GetUsersHandler());

router.set(
  Method.POST,
  "/",
  RequestHandler.builder(new ValidationHandler(schema))
    .set(new SignupUserHandler())
    .build()
);

router.set(Method.GET, "/:id", new GetUserHandler());

export { router };
