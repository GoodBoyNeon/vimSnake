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

  for (let i = 0; i < snake.length; i++) {
    html += `<div class="snake" style="grid-area: ${snake[i][1]} / ${snake[i][0]}"></div>`;
    if (i !== 0 && snake[0][1] === snake[i][1] && snake[0][0] === snake[i][0]) {
      gameOver();
    }
  }

  html += `<div class="apple" style="grid-area: ${applePositionY} / ${applePositionX}"></div>`;

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
