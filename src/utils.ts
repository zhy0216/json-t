import fs from "fs";
export const readJson = (fileName: string) => {
  return JSON.parse(fs.readFileSync(fileName, "utf8"));
};
