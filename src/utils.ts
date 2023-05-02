import fs from "fs";
import { JSONObject } from "./types";
export const readJson = (fileName: string) => {
  return JSON.parse(fs.readFileSync(fileName, "utf8"));
};

export const isObject = (data: any): data is JSONObject =>
  data !== null && typeof data === "object";
