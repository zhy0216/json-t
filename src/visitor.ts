import { JSONObject, JSONValue, ParseContext } from "./types";
import { extraJmesPath, isObject, readJson } from "./utils";
import { resolve } from "path";
import path from "path";
import * as jmespath from "jmespath";

export interface IJsonTVisitor {
  parse(data: JSONValue): JSONValue;
  parseArray(data: JSONValue[]): JSONValue[];
  parseObject(data: JSONObject): JSONObject;
  parse$extend(extendedJson: JSONValue | undefined): JSONValue | undefined;
}

export class JsonTVisitor implements IJsonTVisitor {
  context: ParseContext;

  constructor(context: ParseContext) {
    this.context = context;
  }
  parse(data: JSONValue): JSONValue {
    if (Array.isArray(data)) {
      return data.map((v) => this.parse(v));
    } else if (isObject(data)) {
      return this.parseObject(data);
    } else {
      return data;
    }
  }
  parseArray(data: JSONValue[]) {
    return data.map((v) => this.parse(v));
  }

  parseObject(data: JSONObject): JSONObject {
    const { $extend, ...rest } = data;
    const extendedJson = this.parse$extend($extend) as JSONObject;
    const parsedJson = Object.keys(rest).reduce(
      (prev, curr) => ({ ...prev, [curr]: this.parse(rest[curr]) }),
      {}
    );

    return { ...extendedJson, ...parsedJson };
  }

  parse$extend(extendedJson: JSONValue | undefined): JSONValue | undefined {
    // jmespath here
    // extend can be an array?
    // if ($extend && typeof $extend === "string") {
    //   if (this.context[$extend]) {
    //     extendedJson = this.context[$extend];
    //   } else {

    if (!extendedJson) {
      return undefined;
    }

    // const jmespathExp = extraJmesPath(resolve($extend));
    //
    // const pathData = path.parse(jmespathExp.path);
    // extendedJson = parseFile(pathData.base, pathData.dir, this.context);
    // if (jmespathExp.pipeExp) {
    //   extendedJson = jmespath.search(extendedJson, jmespathExp.pipeExp);
    // }
    // }

    if (!isObject(extendedJson)) {
      throw new Error(`wrong with extend: ${extendedJson}`);
    }

    return extendedJson;
  }
}

export class FileResolver extends JsonTVisitor {
  context: ParseContext;
  dir: string;
  fileName: string;
  constructor(fileName: string, dir: string, context: ParseContext) {
    super(context);
    this.context = context;
    this.dir = dir;
    this.fileName = fileName;
  }
  parse$extend(extendedJson: JSONValue | undefined): JSONValue | undefined {
    if (typeof extendedJson === "string") {
      const filePath = resolve(this.dir, this.fileName);
      const data = readJson(filePath);
      this.context[filePath] = data;
      return data;
    }

    return extendedJson;
  }
}

export class RelativeFilePathResolver extends JsonTVisitor {
  context: ParseContext;
  dir: string;
  constructor(dir: string, context: ParseContext) {
    super(context);
    this.context = context;
    this.dir = dir;
  }
  parse$extend(extendedJson: JSONValue | undefined): JSONValue | undefined {
    if (typeof extendedJson === "string") {
      return resolve(this.dir, extendedJson as string);
    }

    return extendedJson;
  }
}

export const visit = (
  visitors: IJsonTVisitor[],
  data: JSONValue
): JSONValue => {
  for (const visitor of visitors) {
    data = visitor.parse(data);
  }

  return data;
};
