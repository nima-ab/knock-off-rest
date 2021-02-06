import { Request } from '../server/request';
import { Response } from '../server/response';
import { RequestHandler } from '../router/handler';
import { Errors } from '../error/error';
import { Schema } from 'joi';


class ValidationHandler extends RequestHandler {
  schema: Schema;

  constructor(schema: Schema) {
    super();
    this.schema = schema;
  }

  handle(req: Request, res: Response) {
    // console.log('bullshit');
    const { error } = this.schema.validate(req.body);
    // console.log(error);

    if (error) throw new Errors.ValidationError(error);

    return this.next(req, res);
  }
}

export { ValidationHandler }