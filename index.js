"use strict";

window.onload = Main;

/**
 * Core of the application
 * @returns {void}
 */

function Main() {
  const inputSize = document.querySelector("#input-size");
  const showMode = document.querySelector("#show-mode");
  const button = document.querySelector("#start");
  const gridContainer = document.querySelector("#grid-container");
  const select = document.querySelector("#select-color");

  updateGameMode(showMode, inputSize);

  inputSize.addEventListener("input", () =>
    updateGameMode(showMode, inputSize)
  );

  button.addEventListener("pointerdown", () => {
    reset(gridContainer);
    generateContainer(gridContainer, countGridItems(inputSize));
    generateCells(gridContainer, countGridItems(inputSize));

    gridContainer.childNodes.forEach((item) => {
      item.addEventListener("pointerover", (e) => changeColor(e, select));
    });
  });
}

/**
 * @description Generate grid cells on screen
 * @param {Element} gridContainer
 * @param {number} size
 * @returns {void}
 */

function generateCells(gridContainer, size) {
  const area = size ** 2;

  for (let i = 0; i < area; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gridContainer.appendChild(gridItem);
  }
}

/**
 * @description Generate grid container on screen
 * @param {Element} gridContainer
 * @param {number} size
 * @returns {void}
 */

function generateContainer(gridContainer, size) {
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
}

/**
 * @description Append string with current mode and emoji into showMode element
 * @param {Element} showMode
 * @param {HTMLInputElement} inputSize
 */

function updateGameMode(showMode, inputSize) {
  showMode.innerHTML = {
    3: () => "noob <span>&#x1F92A;</span>",
    4: () => "amador <span>&#x1F923;</span>",
    5: () => "PRO <span>&#x1F911;</span>",
  }[inputSize.value]();
}

/**
 * @description Removes this element's childNodes
 * @param {Element} gridContainer
 * @example
 * before:
 * <div id="element">
 *    <span></span>
 *    <p></p>
 * </div>
 *
 * after:
 * <div id="element"></div>
 * @returns {void}
 */

function reset(gridContainer) {
  while (gridContainer.hasChildNodes()) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

/**
 * @param {HTMLInputElement} element
 * @description Generate grid's number of cells which is 2^element
 * @returns {number}
 */
function countGridItems(element) {
  return 2 ** parseInt(element.value, 10);
}

/**
 * @description Change backgroundColor of the hovered cell
 * @param {PointerEvent} event
 * @returns {void}
 */

function changeColor(event, select) {
  paint(event.target.style, pickColor(event.target.style, select.value));
}

/**
 * @description Change selected grid's backgroundColor
 * @param {CSSStyleDeclaration} style
 * @param {string} actualColor
 * @returns {void}
 */
function paint(style, actualColor) {
  style.backgroundColor = actualColor;
}

/**
 * @description Return selected color
 * @param {CSSStyleDeclaration} style
 * @param {string} color
 * @returns {string}
 */
function pickColor(style, color) {
  const palette = {
    black: () => "#000",
    colored: () => colorfy(),
    shine: () => new Shades(style).shine(),
    fade: () => new Shades(style).fade(),
  };
  return palette[color]();
}

/**
 * @description Generates a random color each time.
 * @returns {string}
 */
function colorfy() {
  return `rgb(${randomize()}, ${randomize()}, ${randomize()})`;
}

/**
 * @description Generates a pseudo-random number <= 255 each time.
 * @returns {number}
 */
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
   * @description backgroundColor gets brighter until a 255 shows up in rgb
   * @example
   * const style = { backgroundColor: "rgb(1, 2, 3)"}
   * const result = new Shades(style).shine(); // rgb(26, 27, 28)
   * @returns {string}
   */

  shine() {
    return [this.red, this.green, this.blue].filter((x) => x >= 255)[0]
      ? this.backgroundColor
      : `rgb(${this.red + 25}, ${this.green + 25}, ${this.blue + 25})`;
  }

  /**
   * @description backgroundColor gets darker, until a 25 shows up in rgb
   * @example
   * const style = { backgroundColor: "rgb(100, 100, 50)"}
   * const result = new Shades(style).fade(); // rgb(75, 75, 25)
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
 * let array = validate("rgb(1, 2, 3)"); // [1, 2, 3]
 * @returns {number[]}
 */
function validate(bgColor) {
  return bgColor.match(/\d{1,3}/g).map((x) => parseInt(x, 10));
}

module.exports = {
  Main,
  updateGameMode,
  generateCells,
  generateContainer,
  reset,
  countGridItems,
  changeColor,
  paint,
  pickColor,
  colorfy,
  changeColor,
  randomize,
  Shades,
  validate,
};
