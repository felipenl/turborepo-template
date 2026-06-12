export abstract class DatabaseClient<
  TSchema extends Record<string, unknown> = Record<string, never>,
> {
  protected schema?: TSchema;

  constructor(schema?: TSchema) {
    this.schema = schema;
  }

  abstract connect(): Promise<void> | void;
  abstract disconnect(): Promise<void> | void;
  abstract getClient(): unknown;
}
