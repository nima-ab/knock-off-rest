import { Request } from "../server/request";
import { Response } from "../server/response";
import { RequestHandler } from "../router/handler";
import { ValidationError } from "../error";
import { Schema } from "joi";

class ValidationHandler extends RequestHandler {
  schema: Schema;

  constructor(schema: Schema) {
    super();
    this.schema = schema;
  }

  handle(req: Request, res: Response) {
    const { error } = this.schema.validate(req.body);

    if (error) throw new ValidationError(error);

    return this.next(req, res);
  }
}

export { ValidationHandler };
