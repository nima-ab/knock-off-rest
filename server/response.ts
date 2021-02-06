import http from "http";
import { JsonSerializer } from "../parsers/serializer";

export class Response {
  response: http.ServerResponse;

  constructor(res: http.ServerResponse) {
    this.response = res;
  }

  send(data: any) {
    if (typeof data === "object") {
      this.response.setHeader("content-type", "application/json");
      this.response.write(new JsonSerializer().serialize(data));
      this.response.end();
    } else if (typeof data === "string") {
      this.response.write(data);
      this.response.end();
    }
  }
}
