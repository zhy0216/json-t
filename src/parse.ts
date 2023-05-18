import { extraJmesPath, isObject, readJson } from "./utils";
import { JSONObject, JSONValue, ParseContext } from "./types";
import { resolve } from "path";
import {
  FileResolver,
  JsonTVisitor,
  RelativeFilePathResolver,
  visit,
} from "./visitor";

export const parse = (data: JSONValue, context: ParseContext) => {
  return visit([new JsonTVisitor(context)], data);
};

export const parseFile = <T>(
  fileName: string,
  dir: string,
  context: ParseContext
): T => {
  const filePath = resolve(dir, fileName);
  const data = readJson(filePath);
  return visit(
    [
      new RelativeFilePathResolver(dir, context),
      new FileResolver(dir, context),
      new JsonTVisitor(context),
    ],
    data
  ) as T;
};
