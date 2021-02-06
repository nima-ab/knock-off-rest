interface ISerializer {
  serialize: (input: any) => any;
}

export class JsonSerializer implements ISerializer {
  serialize(obj: Object): string {
    return JSON.stringify(obj);
  }
}
