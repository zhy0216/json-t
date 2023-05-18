import { readJson } from "../src/utils";
import { resolve } from "path";
import { parse, parseFile } from "../src";

const component1Json = readJson(resolve("./mockJson/component1-t.json"));
describe("test $extend", () => {
  it("should $extend all value", () => {
    expect(component1Json.name).toBe("component1");
    const extendJsonT = {
      $extend: "component1.json",
    };

    const parsedJson = parse(extendJsonT, {
      "component1.json": component1Json,
    });

    expect(component1Json).toEqual(parsedJson);
  });

  it("can override value", () => {
    expect(component1Json.name).toBe("component1");
    const extendJsonT = {
      $extend: "component1.json",
      name: "here",
    };

    const { name, ...parsedJson } = parse(extendJsonT, {
      "component1.json": component1Json,
    }) as any;

    expect(parsedJson.body).toEqual(component1Json.body);
    expect(name).toEqual("here");
  });

  it("parseFile", () => {
    const parsedJson = parseFile("component2-t.json", "./mockJson/", {});
    expect(component1Json).toEqual(parsedJson);
  });

  it("should $extend deep", () => {
    const parsedJson = parseFile("component5-t.json", "./mockJson/", {});
    expect(component1Json).toEqual(parsedJson);
  });
});
