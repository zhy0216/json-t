export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONValue[];

export interface JSONObject {
  [x: string]: JSONValue;
}

export type ParseContext = Record<string, JSONValue | undefined>;
