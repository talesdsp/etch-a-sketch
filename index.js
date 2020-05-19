"use strict";

const inputSize = document.querySelector("#input-size");
const showMode = document.querySelector("#show-mode");

window.onload = function main() {
  setMode(showMode, inputSize);

  inputSize.addEventListener("input", () => setMode(showMode, inputSize));

  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    initGrid();
  });
};

function setMode(showMode, { value }) {
  showMode.innerHTML = {
    3: () => "noob <span>&#x1F92A;</span>",
    4: () => "amador <span>&#x1F923;</span>",
    5: () => "PRO <span>&#x1F911;</span>",
  }[value]();
}

function initGrid() {
  const gridContainer = document.querySelector("#grid-container");

  reset(gridContainer);

  startApp(gridContainer, gridSize(inputSize));
}

/**
 * @param {HTMLElement} gridContainer
 * @description removes this element's childNodes
 * @example
 * before:
 * <div id="element">
 *    <span></span>
 *    <p></p>
 * </div>
 *
 * after:
 * <div id="element"></div>
 */
function reset(gridContainer) {
  while (gridContainer.hasChildNodes()) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

function gridSize({ value }) {
  return 2 ** parseInt(value, 10);
}

function startApp(gridContainer, size) {
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  const area = size ** 2;
  for (let i = 0; i < area; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridContainer.appendChild(gridItem);
  }

  const gridList = document.querySelectorAll(".grid-item");
  gridList.forEach((item) => {
    item.addEventListener("pointerenter", (e) => cb(e));
  });
}

function cb({ target: { style } }) {
  const value = document.querySelector("#select-color").value;
  paint(style, pickColor(style, value));
}

function paint(style, actualColor) {
  style.backgroundColor = actualColor;
}

function pickColor(style, color) {
  const palette = {
    black: () => "#000",
    colored: () => colorfy(),
    shine: () => new Shades(style).shine(),
    fade: () => new Shades(style).fade(),
  };
  return palette[color]();
}

function colorfy() {
  return `rgb(${randomize()}, ${randomize()}, ${randomize()})`;
}

function randomize() {
  return Math.floor(Math.random() * 255);
}

class Shades {
  /**
   * @param { CSSStyleDeclaration } style
   */

  constructor(style) {
    style.backgroundColor
      ? (this.backgroundColor = style.backgroundColor)
      : (this.backgroundColor = "rgb(255, 255, 255)");
    [this.red, this.green, this.blue] = validate(this.backgroundColor);
  }

  /**
   * @description gets brighter until a 255 shows up in rgb
   * @returns {string}
   */

  shine() {
    return [this.red, this.green, this.blue].filter((x) => x >= 255)[0]
      ? this.backgroundColor
      : `rgb(${this.red + 25}, ${this.green + 25}, ${this.blue + 25})`;
  }

  /**
   * @description gets darker, until a 25 shows up in rgb
   * @returns {string}
   */
  fade() {
    return [this.red, this.green, this.blue].filter((x) => x <= 25)[0]
      ? this.backgroundColor
      : `rgb(${this.red - 25}, ${this.green - 25}, ${this.blue - 25})`;
  }
}

/**
 * @param {string} bgColor
 * @description extract numbers from rgb
 * @example
 * let array = validate("rgb(1, 2, 3)")
 * array === [1, 2, 3]
 * @returns {number[]}
 */
function validate(bgColor) {
  return bgColor.match(/\d{1,3}/g).map((x) => parseInt(x, 10));
}

module.exports = {
  setMode,
  initGrid,
  reset,
  gridSize,
  startApp,
  cb,
  paint,
  pickColor,
  colorfy,
  randomize,
  Shades,
  validate,
};
