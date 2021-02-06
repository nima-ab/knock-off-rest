import http from "http";
import { parsers } from "../parsers/parser";
export class Request {
  request: http.IncomingMessage;
  body?: any;
  rawData?: any;
  constructor(req: http.IncomingMessage, data?: any) {
    this.request = req;
    this.rawData = data;
    parsers.handle(this);
  }
}
