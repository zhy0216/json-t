import { extraJmesPath, isObject, readJson } from "./utils";
import { JSONObject, JSONValue, ParseContext } from "./types";
import * as path from "path";
import { resolve } from "path";
import * as jmespath from "jmespath";

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

  if (!$extend) {
    return data;
  }

  // jmespath here
  // extend can be an array?
  let extendedJson: JSONValue | undefined = undefined;
  if ($extend && typeof $extend === "string") {
    if (context[$extend]) {
      extendedJson = context[$extend];
    } else {
      const jmespathExp = extraJmesPath(resolve($extend));

      const pathData = path.parse(jmespathExp.path);
      extendedJson = parseFile(pathData.base, pathData.dir, context);
      if (jmespathExp.pipeExp) {
        extendedJson = jmespath.search(extendedJson, jmespathExp.pipeExp);
      }
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
          : { ...prev, [curr]: data[curr] },
      {}
    );
  } else {
    return data;
  }
};
