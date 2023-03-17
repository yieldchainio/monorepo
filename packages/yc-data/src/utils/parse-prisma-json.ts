export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | null;
export type JsonObject = { [Key in string]?: JsonValue };

export interface JsonArray extends Array<JsonValue> {}

export const prismaToJson = <T>(_prismaJson: JsonValue) => {
  return JSON.parse(JSON.stringify(_prismaJson)) as T;
};
