export class CustomError extends Error {
  constructor(
    public override name: string,
    public override message: string,
    public status: number = 400,
    public data?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  public override toString() {
    return `${this.name}: ${this.message}`;
  }

  public getData() {
    return this.data;
  }
}
