const canvas = document.getElementById("tictactoe");
const ctx = canvas.getContext("2d");
const size = 3;
const cell = canvas.width / size;
let board = Array(size).fill().map(() => Array(size).fill(null));
let current = "X";
let gameOver = false;

/* === Draw Board === */
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  for (let i = 1; i < size; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cell, 0);
    ctx.lineTo(i * cell, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cell);
    ctx.lineTo(canvas.width, i * cell);
    ctx.stroke();
  }
  board.forEach((row, y) => row.forEach((val, x) => {
    if (val) {
      ctx.fillStyle = val === "X" ? "#fff" : "#0f0";
      ctx.font = "bold 80px Burbank";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(val, x * cell + cell / 2, y * cell + cell / 2);
    }
  }));
}

/* === Check Winner === */
function checkWinner(b) {
  for (let i = 0; i < size; i++) {
    if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
    if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i];
  }
  if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
  if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
  return null;
}

/* === AI Move === */
function aiMove() {
  let empty = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!board[y][x]) empty.push([x, y]);
  if (!empty.length) return;
  const [x, y] = empty[Math.floor(Math.random() * empty.length)];
  board[y][x] = "O";
}

/* === Handle Click === */
canvas.addEventListener("click", e => {
  if (gameOver) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cell);
  const y = Math.floor((e.clientY - rect.top) / cell);
  if (!board[y][x]) {
    board[y][x] = current;
    if (checkWinner(board)) gameOver = true;
    else { aiMove(); if (checkWinner(board)) gameOver = true; }
  }
  drawBoard();
});
drawBoard();

(function attachTTTOutsideCard() {
  const card = document.querySelectorAll('.card')[1];
  const container = document.querySelector('#tictactoe-container');
  if (!card || !container) return;

  document.body.appendChild(container);

  function positionContainer() {
    const rect = card.getBoundingClientRect();
    const w = container.offsetWidth;
    const h = container.offsetHeight;

    // leicht nach außen verschoben (optisch halb-raus)
    const left = rect.right - w * 0.6;
    const top = rect.bottom - h * 0.55;

    container.style.left = `${left}px`;
    container.style.top = `${top}px`;
  }

  positionContainer();
  window.addEventListener('resize', positionContainer);

  const observer = new MutationObserver(() => {
    if (card.classList.contains('active')) container.style.opacity = 1;
    else container.style.opacity = 0;
    positionContainer();
  });
  observer.observe(card, { attributes: true, attributeFilter: ['class'] });
})();