import { parseFile } from "../src";

describe("test pip", () => {
  it("should pick name", () => {
    const parsedJson = parseFile("component3-t.json", "./mockJson/", {});
    expect(parsedJson).toEqual({
      deepProp: {
        veryDeep: "here",
      },
    });
  });
});
