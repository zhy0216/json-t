import { isObject } from "./utils";
import { JSONObject, JSONValue, ParseContext } from "./types";
import * as path from "path";
import { parseFile } from "./parseFile";
import { resolve } from "path";

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
  let extendedJson: JSONValue | undefined = undefined;
  if ($extend && $extend === "string") {
    if (context[$extend]) {
      extendedJson = context[$extend];
    } else {
      const pathData = path.parse(resolve($extend));
      extendedJson = parseFile(pathData.base, pathData.dir, context);
    }
  }

  if (!isObject(extendedJson)) {
    throw new Error(`wrong with extend: ${$extend}`);
  }

  const parsedJson = Object.keys(rest).reduce(
    (prev, curr) => ({ ...prev, [curr]: parse(rest[curr], context) }),
    {}
  );

  return { ...extendedJson, ...parsedJson };
};
