import http from "http";
import { JsonSerializer } from "../parsers/serializer";

export class Response {
  response: http.ServerResponse;

  constructor(res: http.ServerResponse) {
    this.response = res;
  }

  status(status: number): Response {
    this.response.statusCode = status;
    return this;
  }

  send(data: any) {
    // console.log('sending some bullshit');
    // console.log(typeof data);
    if (typeof data === "object") {
      this.response.setHeader("content-type", "application/json");
      this.response.write(new JsonSerializer().serialize(data));
      this.response.end();
    } else if (typeof data === "string") {
      this.response.write(data);
      this.response.end();
    } else {
      this.response.end(data);
    }
  }
}
