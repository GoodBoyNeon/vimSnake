const canvas = document.getElementById("canvas");
const scoreElem = document.getElementById("score");
const highestScoreElem = document.getElementById("highest");

let movementX = 0;
let movementY = 0;
let snakePositionX = 8;
let snakePositionY = 8;

function getRandomPosition() {
  return Array(2)
    .fill(0)
    .map(() => Math.floor(Math.random() * (15 - 1 + 1) + 1));
}

let [applePositionX, applePositionY] = getRandomPosition();

function resetApple() {
  const [x, y] = getRandomPosition();
  applePositionX = x;
  applePositionY = y;
}
while (applePositionX === snakePositionX && applePositionY === snakePositionY) {
  resetApple();
}

let gameLoopId;

const controls = {
  up: "k",
  down: "j",
  left: "h",
  right: "l",
};

document.addEventListener("keydown", (e) => {
  const { key } = e;

  const validKeys = Object.values(controls);
  if (!validKeys.includes(key)) return;

  move(key);
});

function gameLoop() {
  gameLoopId = setInterval(game, 1000 / 8);
}

function move(key) {
  switch (key) {
    case "h":
      movementX = -1;
      movementY = 0;
      break;
    case "j":
      movementX = 0;
      movementY = 1;
      break;
    case "k":
      movementX = 0;
      movementY = -1;
      break;
    case "l":
      movementX = 1;
      movementY = 0;
      break;
  }
}

function gameOver() {
  alert("You died... GG!");
  clearInterval(gameLoopId);

  movementX = 0;
  movementY = 0;
  snakePositionX = 8;
  snakePositionY = 8;
  gameLoop();
}
function game() {
  let highest = localStorage.getItem("highest") || 0;
  highestScoreElem.innerText = `Highest: ${highest}`;

  snakePositionX += movementX;
  snakePositionY += movementY;
  let html;

  if (snakePositionX === applePositionX && snakePositionY === applePositionY) {
    resetApple();
  }
  html += `<div class="apple" style="grid-area: ${applePositionY} / ${applePositionX}"></div>`;

  html += `<div class="snake" style="grid-area: ${snakePositionY} / ${snakePositionX}"></div>`;

  if (
    snakePositionX < 1 ||
    snakePositionX > 15 ||
    snakePositionY < 1 ||
    snakePositionY > 15
  ) {
    return gameOver();
  }
  canvas.innerHTML = html;
}

gameLoop();
