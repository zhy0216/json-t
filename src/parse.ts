type JSONValue = string | number | boolean | null | JSONObject | JSONValue[];

interface JSONObject {
  [x: string]: JSONValue;
}

export type ParseContext = Record<string, JSONValue | undefined>;

const isObject = (data: any): data is JSONObject =>
  data !== null && typeof data === "object";

export const parse = (data: JSONValue, context: ParseContext): JSONValue => {
  if (Array.isArray(data)) {
    return data.map((v) => parse(v, context));
  } else if (isObject(data)) {
    return parseObject(data, context);
  } else {
    return data;
  }
};

const parseObject = (data: JSONObject, context: ParseContext): JSONObject => {
  const { $extend, ...rest } = data;

  // jmespath here
  // extend can be an array?
  const extendedJson =
    typeof $extend === "string" ? context[$extend] : undefined;
  if (!isObject(extendedJson)) {
    throw new Error(`wrong with extend: ${$extend}`);
  }

  const parsedJson = Object.keys(rest).reduce(
    (prev, curr) => ({ ...prev, [curr]: parse(rest[curr], context) }),
    {}
  );

  return { ...extendedJson, ...parsedJson };
};
