import Joi from "joi";
import { join } from "path";
import { Method } from "../constants";
import { NotFoundError } from "../error";
import { ValidationHandler } from "../middlewares/validation-handler";
import { ComplexRouter, RequestHandler } from "../router";
import { Request, Response } from "../server";

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

class GetUserHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    let user = undefined;

    for (const u of users) {
      if (u.id === req.params?.id) user = u;
    }

    if (!user)
      throw new NotFoundError("Didn't find any user with the given id!");

    res.send(user);
  }
}
class GetUsersHandler extends RequestHandler {
  handle(req: Request, res: Response): void {
    res.send(users);
  }
}
const schema = Joi.object({
  name: Joi.string().required(),
  pass: Joi.string().required().min(6).max(16),
  email: Joi.string().email(),
});

class SignupUserHandler extends RequestHandler {
  private id: number;
  constructor() {
    super();
    this.id = users.length;
  }
  handle(req: Request, res: Response): void {
    const user = {
      ...req.body,
      id: `${++this.id}`,
    };
    users.push(user);

    res.status(201).send(user);
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
