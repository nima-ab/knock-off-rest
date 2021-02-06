import http from "http";
import { parsers } from "../parsers/parser";
export class Request {
  request: http.IncomingMessage;
  body?: any;
  private _rawData?: any;
  params?: any;
  query?: any;
  querystr?: string;
  constructor(req: http.IncomingMessage) {
    this.request = req;
  }

  set rawData(data: any) {
    this._rawData = data;
    this.body = parsers.parse(data);
  }

  get rawData() {
    return this._rawData;
  }
}
