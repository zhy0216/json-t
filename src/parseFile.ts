import { type ParseContext } from "./types";
import { resolve } from "path";
import { isObject, readJson } from "./utils";
import { parse } from "./parse";

export const parseFile = <T>(
  fileName: string,
  dir: string,
  context: ParseContext
): T => {
  const filePath = resolve(dir, fileName);
  const data = readJson(filePath);

  return parse(data, { ...context, [filePath]: data }) as T;
};
