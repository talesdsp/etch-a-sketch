"use strict";

const inputSize = document.querySelector("#input-size");
const showMode = document.querySelector("#show-mode");

window.onload = function main() {
  setMode(showMode, inputSize);

  inputSize.addEventListener("input", () => setMode(showMode, inputSize));

  document.querySelector("#form").addEventListener("submit", e => {
    e.preventDefault();
    initGrid();
  });
};

function setMode(showMode, { value }) {
  showMode.innerHTML = Object.freeze(
    {
      3: () => "noob <span>&#x1F92A;</span>",
      4: () => "amador <span>&#x1F923;</span>",
      5: () => "PRO <span>&#x1F911;</span>"
    }[value]()
  );
}

function initGrid() {
  const gridContainer = document.querySelector("#grid-container");

  reset(gridContainer);
  startApp(gridContainer, gridSize(inputSize));
}

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
  gridList.forEach(item => {
    item.addEventListener("pointerenter", e => cb(e));
  });
}

function cb({ target: { style } }) {
  const value = document.querySelector("#select-color").value;
  paint(style, pickColor(style, value));
}

function paint(style, actualColor) {
  style.backgroundColor = actualColor;
  console.log(style);
}

function pickColor(style, mode) {
  return Object.freeze(
    {
      black: () => "#000",
      colored: () => colorfy(),
      shine: () => new Shades(style).shine(),
      fade: () => new Shades(style).fade()
    }[mode]()
  );
}

function colorfy() {
  return `rgb(${randomize()}, ${randomize()}, ${randomize()})`;
}

function randomize() {
  return Math.floor(Math.random() * 255);
}

class Shades {
  constructor({ backgroundColor }) {
    backgroundColor
      ? (this.backgroundColor = backgroundColor)
      : (this.backgroundColor = "rgb(255, 255, 255)");

    [this.red, this.green, this.blue] = validate(this.backgroundColor);
  }

  /**
   * gets brighter until a 255 shows up in rgb
   */

  shine() {
    return [this.red, this.green, this.blue].filter(x => x >= 255)[0]
      ? this.backgroundColor
      : `rgb(${this.red + 25}, ${this.green + 25}, ${this.blue + 25})`;
  }

  /**
   * gets darker, until a 25 shows up in rgb
   */
  fade() {
    return [this.red, this.green, this.blue].filter(x => x <= 25)[0]
      ? this.backgroundColor
      : `rgb(${this.red - 25}, ${this.green - 25}, ${this.blue - 25})`;
  }
}

function validate(bgColor) {
  //return css rgb nums
  return bgColor.match(/\d{1,3}/g).map(x => parseInt(x, 10));
}
