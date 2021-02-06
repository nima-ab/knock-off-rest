import { Request } from "../server";

interface IParser {
  parse: (input: any) => any;
}

abstract class ParserChain implements IParser {
  protected nextParser?: ParserChain;
  abstract contentType: string;

  get parser() {
    if (!this.nextParser) throw new Error("null");

    return this.nextParser;
  }

  handle(req: Request): void {
    if (this.contentType !== req.request.headers["content-type"])
      return this.parser.handle(req);

    req.body = this.parse(req.rawData);
  }
  setNext(parser: ParserChain): ParserChain {
    this.nextParser = parser;
    return parser;
  }

  abstract parse(input: any): any;
}

class JsonParser extends ParserChain {
  contentType = "application/json";
  constructor() {
    super();
  }

  parse(text: Buffer): object {
    return JSON.parse(text.toString());
  }
}
class TextParser extends ParserChain {
  contentType = "text/plain";
  constructor() {
    super();
  }

  parse(text: Buffer): string {
    return text.toString();
  }
}

export const parsers = new JsonParser();
parsers.setNext(new TextParser());
