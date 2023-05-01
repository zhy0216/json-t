import { type ParseContext } from "./parse";
import { resolve, parse } from "path";
import { readJson } from "./utils";

export const parseFile = <T>(
  fileName: string,
  dir: string,
  context: ParseContext
): T => {
  const filePath = resolve(dir, fileName);
  const json = readJson(filePath);
  // todo
  return json;
};
