import fs from "fs";
import { JSONObject } from "./types";
export const readJson = (fileName: string) => {
  return JSON.parse(fs.readFileSync(fileName, "utf8"));
};

export const isObject = (data: any): data is JSONObject =>
  data !== null && typeof data === "object";

export const extraJmesPath = (
  s: string
): { path: string; pipeExp?: string } => {
  const index = s.indexOf("|");
  if (index < 0) {
    return { path: s };
  } else {
    return { path: s.slice(0, index).trim(), pipeExp: s.slice(index + 1) };
  }
};
