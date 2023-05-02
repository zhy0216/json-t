import { parseFile } from "../src";

describe("test pip", () => {
  it("should pick name", () => {
    const parsedJson = parseFile("component3-t.json", "./mockJson/", {});
    expect(parsedJson).toEqual({
      veryDeep: "here",
    });
  });

  it("nest extend", () => {
    const parsedJson = parseFile("component4-t.json", "./mockJson/", {}) as any;
    expect(parsedJson.name).toEqual("here");
    expect(parsedJson.body.name).toEqual("changed");
    expect(parsedJson.body.deepProp).toEqual({
      veryDeep: "here",
    });
  });
});
