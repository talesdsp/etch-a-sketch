const {
  Main,
  countGridItems,
  colorfy,
  randomize,
  validate,
  paint,
  pickColor,
  updateGameMode,
  reset,
  changeColor,
  generateCells,
  generateContainer,
  Shades,
} = require("./index");
const { screen } = require("@testing-library/dom");
require("@testing-library/jest-dom");

/**
 * randomize()
 */

describe("randomize()", () => {
  test.each([...Array(10)].map(() => [randomize()]))("%s <= 255", (a) => {
    expect(a).toBeLessThanOrEqual(255);
  });
});

/**
 * colorfy()
 */

describe("colorfy()", () => {
  it("Should return correct CSS3 rgb() style", () => {
    /**
     * Regex matches this pattern
     * rgb(@param {number <=255}, @param {number <=255}, @param {number <=255})
     */

    const regex = /rgb\((\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2}), (\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2}), (\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2})\)/g;

    expect(regex.test(colorfy())).toBeTruthy();
  });
});

/**
 * countGridItems()
 */

describe("countGridItems()", () => {
  test.each([
    ["0", 1],
    ["1", 2],
    ["3", 8],
    ["6", 64],
  ])("2 ** %i === %i", (a, b) => {
    expect(countGridItems({ value: a })).toEqual(b);
  });
});

/**
 * validate()
 */

describe("validate()", () => {
  it("Should extract numbers from rgb", () => {
    expect(validate("rgb(12, 34, 49)")).toEqual([12, 34, 49]);
  });
});

/**
 * paint()
 */

describe("paint()", () => {
  let style = { backgroundColor: "rgb(23, 23, 23)" };

  it("Should update backgroundColor", () => {
    expect(style.backgroundColor).toEqual("rgb(23, 23, 23)");

    paint(style, "rgb(10, 10, 10)");
    expect(style.backgroundColor).toEqual("rgb(10, 10, 10)");
  });
});

/**
 * pickColor()
 */

describe("pickColor()", () => {
  let style = { backgroundColor: "rgb(50, 50, 50)" };
  let callPickColor = (color) => pickColor(style, color);

  test.each([
    ["black", /\#000/g],
    [
      "colored",
      /rgb\((\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2}), (\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2}), (\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2})\)/g,
    ],
    ["shine", /rgb\(75, 75, 75\)/g],
    ["fade", /rgb\(25, 25, 25\)/g],
  ])("%s return %s", (colorName, regex) => {
    expect(regex.test(callPickColor(colorName))).toBeTruthy();
  });
});

/**
 * class Shades
 */

describe("class Shades", () => {
  describe("shine()", () => {
    it("Should add 25 to each field", () => {
      let style = { backgroundColor: "rgb(1, 1, 1)" };
      expect(new Shades(style).shine()).toEqual("rgb(26, 26, 26)");
    });
    it("Should return the input", () => {
      let style = { backgroundColor: "rgb(255, 255, 255)" };
      expect(new Shades(style).shine()).toEqual("rgb(255, 255, 255)");
    });
  });

  describe("fade()", () => {
    it("Should remove 25 from each field", () => {
      let style = { backgroundColor: "rgb(255, 255, 255)" };
      expect(new Shades(style).fade()).toEqual("rgb(230, 230, 230)");
    });

    it("Should return the input", () => {
      let style = { backgroundColor: "rgb(25, 25, 25)" };
      expect(new Shades(style).fade()).toEqual("rgb(25, 25, 25)");
    });
  });
});

/**
 * updateGameMode()
 */

describe("updateGameMode()", () => {
  document.body.innerHTML =
    "<div>" +
    "<div data-testId='input-size'></div>" +
    "<div data-testId='show-mode'></div>" +
    "</div>";

  const showMode = screen.queryByTestId("show-mode");

  it("Should return empty string", () => {
    expect(showMode.innerHTML).toEqual("");
  });

  test.each([
    [/^noob <span>(.{1,9})<\/span>/g, showMode, { value: 3 }],
    [/^amador <span>(.{1,9})<\/span>/g, showMode, { value: 4 }],
    [/^PRO <span>(.{1,9})<\/span>/g, showMode, { value: 5 }],
  ])("add element to document", (regex, element, option) => {
    updateGameMode(element, option);
    expect(regex.test(element.innerHTML)).toBeTruthy();
  });
});

/**
 * reset()
 */

describe("reset()", () => {
  document.body.innerHTML =
    "<div>" +
    "<div data-testId='grid-container'>" +
    "<div data-testId='child'></div>" +
    "<div data-testId='child'></div>" +
    "<div data-testId='child'></div>" +
    "</div>" +
    "</div>";

  const grid = screen.queryByTestId("grid-container");

  it("Should have child nodes", () => {
    expect(grid.hasChildNodes()).toEqual(true);
  });

  it("Should have 3 child nodes", () => {
    expect(grid.childNodes.length).toEqual(3);
  });

  it("Should remove children", () => {
    reset(grid);

    expect(grid.hasChildNodes()).toBeFalsy();
    expect(grid.childNodes.length).toEqual(0);
  });
});

/**
 * changeColor()
 */

describe("changeColor()", () => {
  let event;

  beforeEach(() => {
    event = { target: { style: { backgroundColor: "rgb(50, 50, 50)" } } };
  });

  it("Should paint it black", () => {
    document.body.innerHTML =
      "<select id='select-color'>" +
      "<option selected='selected' value='black'>black</option>" +
      "</select>";

    changeColor(event);
    expect(event.target.style.backgroundColor).toEqual("#000");
  });

  it("Should paint it randomly", () => {
    document.body.innerHTML =
      "<select id='select-color'>" +
      "<option selected='selected' value='colored'>Rainbow</option>" +
      "</select>";

    const regex = /rgb\((\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2}), (\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2}), (\d|\d{2}|1\d{2}|2[0-4]\d|2[0-5]{2})\)/g;

    changeColor(event);
    expect(regex.test(event.target.style.backgroundColor)).toBeTruthy();
  });

  it("Should paint it brighter", () => {
    document.body.innerHTML =
      "<select id='select-color'>" +
      "<option selected='selected' value='shine'>Shine</option>" +
      "</select>";

    changeColor(event);
    expect(event.target.style.backgroundColor).toEqual("rgb(75, 75, 75)");
  });

  it("Should paint it darker", () => {
    document.body.innerHTML =
      "<select id='select-color'>" +
      "<option selected='selected' value='fade'>Fade</option>" +
      "</select>";

    changeColor(event);
    expect(event.target.style.backgroundColor).toEqual("rgb(25, 25, 25)");
  });
});

/**
 * generateContainer()
 */
describe("generateContainer", () => {
  it("Should apply CSS styles to container", () => {
    document.body.innerHTML =
      "<div><div data-testId='grid-container'></div></div>";
    const grid = screen.queryByTestId("grid-container");

    generateContainer(grid, 8);
    expect(grid.style.gridTemplateRows).toEqual("repeat(8, 1fr)");
    expect(grid.style.gridTemplateColumns).toEqual("repeat(8, 1fr)");
  });
});

/**
 * generateCells()
 */
describe("generateCells", () => {
  it("Should generate", () => {
    document.body.innerHTML =
      "<div><div data-testId='grid-container'></div></div>";
    const grid = screen.queryByTestId("grid-container");
    generateCells(grid, 8);
    expect(grid.childNodes.length).toEqual(64);
  });
});
