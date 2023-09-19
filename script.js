const canvas = document.getElementById("canvas");
const scoreElem = document.getElementById("score");
const highestScoreElem = document.getElementById("highest");

let snake, score, movementX, movementY, snakePositionX, snakePositionY;

function reset() {
  snake = [];
  score = 0;
  movementX = 0;
  movementY = 0;
  snakePositionX = 8;
  snakePositionY = 8;
}
reset();

/*
 * @returns {number[]}
 */
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
  score++;
}

let gameLoopId;

document.addEventListener("keydown", (e) => {
  const { key } = e;
  console.log(key);

  const allowArrowKeys = document.getElementById("arrow-keys-toggle").checked;
  move(key, allowArrowKeys);
});

function gameLoop() {
  gameLoopId = setInterval(game, 1000 / 8);
}

/**
 * @param {string} key
 * @param {boolean} allowArrowKeys
 */
function move(key, allowArrowKeys) {
  const keyTable = new Map();
  keyTable.set("h", "left");
  keyTable.set("j", "down");
  keyTable.set("k", "up");
  keyTable.set("l", "right");

  if (allowArrowKeys) {
    keyTable.set("ArrowLeft", "left");
    keyTable.set("ArrowDown", "down");
    keyTable.set("ArrowUp", "up");
    keyTable.set("ArrowRight", "right");
  }

  const actionsTable = new Map();

  actionsTable.set("left", () => {
    if (movementX === 1) return;
    movementX = -1;
    movementY = 0;
  });
  actionsTable.set("up", () => {
    if (movementY === 1) return;
    movementX = 0;
    movementY = -1;
  });
  actionsTable.set("down", () => {
    if (movementY === -1) return;
    movementX = 0;
    movementY = 1;
  });
  actionsTable.set("right", () => {
    if (movementX === -1) return;
    movementX = 1;
    movementY = 0;
  });

  const action = keyTable.get(key);
  if (!action) return;
  actionsTable.get(action)();
}

function gameOver() {
  alert("You died... GG!");
  clearInterval(gameLoopId);
  const highest = localStorage.getItem("highest") || 0;
  localStorage.setItem("highest", score > highest ? score : highest);
  reset();
  gameLoop();
}

function game() {
  const highest = localStorage.getItem("highest") || 0;
  highestScoreElem.innerText = `Highest: ${highest}`;
  scoreElem.innerText = `Score: ${score}`;

  snakePositionX += movementX;
  snakePositionY += movementY;

  let html = "";

  if (snakePositionX === applePositionX && snakePositionY === applePositionY) {
    resetApple();
    score++;
    scoreElem.innerText = `Score: ${score}`;

    snake.push([applePositionX, applePositionY]);
  }

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
  }

  snake[0] = [snakePositionX, snakePositionY];

  html += `<div class="snake-head" style="grid-area: ${snake[0][1]} / ${snake[0][0]}"></div>`;
  for (let i = 1; i < snake.length; i++) {
    html += `<div class="snake" style="grid-area: ${snake[i][1]} / ${snake[i][0]}"></div>`;
    if (i !== 0 && snake[0][1] === snake[i][1] && snake[0][0] === snake[i][0]) {
      gameOver();
    }
  }

  // html += `<div class="apple" style="grid-area: ${applePositionY} / ${applePositionX}"></div>`;
  html += `<img src="img/apple.png" class="apple" style="grid-area: ${applePositionY} / ${applePositionX}"></div>`;

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
