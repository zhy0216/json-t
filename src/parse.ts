import { extraJmesPath, isObject, readJson } from "./utils";
import { JSONObject, JSONValue, ParseContext } from "./types";
import * as path from "path";
import { resolve } from "path";
import * as jmespath from "jmespath";

export const parse = (data: JSONValue, context: ParseContext) => {};

export const parseFile = <T>(
  fileName: string,
  dir: string,
  context: ParseContext
): T => {
  const filePath = resolve(dir, fileName);
  const data = readJson(filePath);
  const resolvedRelativeFile = parseFileRelativePath(data, dir);

  return parse(resolvedRelativeFile, {
    ...context,
    [filePath]: data,
  }) as T;
};

export const parseFileRelativePath = (data: JSONValue, dir: string): any => {
  if (Array.isArray(data)) {
    return data.map((v) => parseFileRelativePath(v, dir));
  } else if (isObject(data)) {
    return Object.keys(data).reduce(
      (prev, curr) =>
        curr === "$extend"
          ? { ...prev, $extend: resolve(dir, data[curr] as string) }
          : { ...prev, [curr]: parseFileRelativePath(data[curr], dir) },
      {}
    );
  } else {
    return data;
  }
};
