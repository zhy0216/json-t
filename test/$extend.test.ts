import { readJson } from "../src/utils";
import { resolve } from "path";
import { parse } from "../src";

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
});
