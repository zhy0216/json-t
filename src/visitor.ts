import { JSONObject, JSONValue, ParseContext } from "./types";
import { extraJmesPath, isObject, readJson } from "./utils";
import { resolve } from "path";
import path from "path";
import * as jmespath from "jmespath";
import { parseFile } from "./parse";

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
    if (typeof extendedJson === "string" && this.context[extendedJson]) {
      extendedJson = this.context[extendedJson];
    }
    return extendedJson;
  }
}

export class FileResolver extends JsonTVisitor {
  context: ParseContext;
  dir: string;
  constructor(dir: string, context: ParseContext) {
    super(context);
    this.context = context;
    this.dir = dir;
  }

  parseObject(data: JSONObject): JSONObject {
    const { $extend, ...rest } = data;
    const extendedJson = this.parse$extend($extend) as JSONObject;
    const parsedJson = Object.keys(rest).reduce(
      (prev, curr) => ({ ...prev, [curr]: this.parse(rest[curr]) }),
      {}
    );

    return { $extend: extendedJson, ...parsedJson };
  }
  parse$extend(extendedJson: JSONValue | undefined): JSONValue | undefined {
    if (typeof extendedJson === "string") {
      const jmespathExp = extraJmesPath(resolve(extendedJson));
      const pathData = path.parse(jmespathExp.path);
      const filePath = resolve(pathData.dir, pathData.base);
      let data = parseFile<JSONValue>(
        pathData.base,
        pathData.dir,
        this.context
      );
      if (jmespathExp.pipeExp) {
        data = jmespath.search(data, jmespathExp.pipeExp);
      }
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

  parseObject(data: JSONObject): JSONObject {
    const { $extend, ...rest } = data;
    const extendedJson = this.parse$extend($extend) as string;
    const parsedJson = Object.keys(rest).reduce(
      (prev, curr) => ({ ...prev, [curr]: this.parse(rest[curr]) }),
      {}
    );

    return { $extend: extendedJson, ...parsedJson };
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
