"use strict";

const form = document.querySelector("#form");
const showMode = document.querySelector("#show-mode");
const inputSize = document.querySelector("#input-size");

window.onload = () => {
  setMode();

  inputSize.addEventListener("input", setMode);

  form.addEventListener("submit", e => {
    e.preventDefault();
    initGrid();
  });
};

function setMode() {
  showMode.textContent = Object.freeze(
    {
      3: () => "TINY",
      4: () => "STUDENT",
      5: () => "PRO"
    }[inputSize.value]()
  );
}

function initGrid() {
  const gridContainer = document.querySelector("#grid-container");

  reset(gridContainer);
  startApp(gridContainer, getSize());
}

function reset(gridContainer) {
  while (gridContainer.hasChildNodes()) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

function getSize() {
  return 2 ** parseInt(inputSize.value);
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
  paint(style, pickColor(style, document.querySelector("#select-color").value));
}

function pickColor(style, mode) {
  return Object.freeze(
    {
      black: () => "#000",
      colored: () => colorfy(),
      greyShades: () => shader(style)
    }[mode]()
  );
}
function paint(style, actualColor) {
  console.log(style, actualColor);
  style.backgroundColor = actualColor;
}

function colorfy() {
  return `rgb(${randomize()}, ${randomize()}, ${randomize()})`;
}

function randomize() {
  return Math.floor(Math.random() * 255);
}

function shader({ backgroundColor }) {
  if (!backgroundColor) {
    backgroundColor = "rgb(255, 255, 255)";
  }
  const [red, green, blue] = validate(backgroundColor);

  return `rgb(${red - 25}, ${green - 25}, ${blue - 25})`;
}

function validate(bgColor) {
  //return css rgb nums
  return bgColor.match(/\d{1,3}/g);
}
