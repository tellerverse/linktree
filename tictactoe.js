const canvas = document.getElementById("tictactoe");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cell = size / 3;
  let board = Array(9).fill(null);
  let player = "X";
  let gameOver = false;

  function drawBoard() {
    ctx.clearRect(0, 0, size, size);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#fff";
    ctx.lineCap = "round";

    // Grid lines
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, size);
      ctx.moveTo(0, i * cell);
      ctx.lineTo(size, i * cell);
      ctx.stroke();
    }

    // Draw marks
    board.forEach((val, i) => {
      const x = (i % 3) * cell + cell / 2;
      const y = Math.floor(i / 3) * cell + cell / 2;
      ctx.strokeStyle = val === "X" ? "#ff66cc" : "#2de42e";
      ctx.lineWidth = 6;
      if (val === "X") {
        ctx.beginPath();
        ctx.moveTo(x - 35, y - 35);
        ctx.lineTo(x + 35, y + 35);
        ctx.moveTo(x + 35, y - 35);
        ctx.lineTo(x - 35, y + 35);
        ctx.stroke();
      } else if (val === "O") {
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function checkWinner(b) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b2,c] of wins)
      if (b[a] && b[a] === b[b2] && b[a] === b[c]) return b[a];
    return b.includes(null) ? null : "draw";
  }

  function minimax(newBoard, isMaximizing) {
    const result = checkWinner(newBoard);
    if (result === "X") return -1;
    if (result === "O") return 1;
    if (result === "draw") return 0;

    const avail = newBoard.map((v,i)=>v===null?i:null).filter(v=>v!==null);
    if (isMaximizing) {
      let best = -Infinity;
      for (let i of avail) {
        newBoard[i] = "O";
        best = Math.max(best, minimax(newBoard, false));
        newBoard[i] = null;
      }
      return best;
    } else {
      let best = Infinity;
      for (let i of avail) {
        newBoard[i] = "X";
        best = Math.min(best, minimax(newBoard, true));
        newBoard[i] = null;
      }
      return best;
    }
  }

  function bestMove() {
    let bestScore = -Infinity;
    let move;
    board.forEach((v,i)=>{
      if(v===null){
        board[i]="O";
        let score=minimax(board,false);
        board[i]=null;
        if(score>bestScore){bestScore=score;move=i;}
      }
    });
    if (move!==undefined) board[move]="O";
  }

  canvas.addEventListener("click", e=>{
    if(gameOver) return;
    const rect=canvas.getBoundingClientRect();
    const x=e.clientX-rect.left;
    const y=e.clientY-rect.top;
    const i=Math.floor(x/cell)+Math.floor(y/cell)*3;
    if(board[i]) return;
    board[i]="X";
    let result=checkWinner(board);
    if(result){
      gameOver=true;
      setTimeout(()=>alert(result==="draw"?"Unentschieden!":`${result} gewinnt!`),200);
      drawBoard();
      return;
    }
    bestMove();
    result=checkWinner(board);
    if(result){
      gameOver=true;
      setTimeout(()=>alert(result==="draw"?"Unentschieden!":`${result} gewinnt!`),200);
    }
    drawBoard();
  });

  drawBoard();
}
