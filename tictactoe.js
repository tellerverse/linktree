const canvas=document.getElementById('tictactoe');
const ctx=canvas.getContext('2d');
let board=[[0,0,0],[0,0,0],[0,0,0]];
let currentPlayer=1;
canvas.width=canvas.clientWidth; canvas.height=canvas.clientHeight;
const cellSize=canvas.width/3;

function drawBoard(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle='#fff';
  ctx.lineWidth=4;
  for(let i=1;i<3;i++){
    ctx.beginPath(); ctx.moveTo(i*cellSize,0); ctx.lineTo(i*cellSize,canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,i*cellSize); ctx.lineTo(canvas.width,i*cellSize); ctx.stroke();
  }
  for(let y=0;y<3;y++) for(let x=0;x<3;x++){
    const val=board[y][x];
    const cx=x*cellSize+cellSize/2;
    const cy=y*cellSize+cellSize/2;
    if(val===1){ctx.strokeStyle='red'; ctx.beginPath(); ctx.moveTo(cx-30,cy-30); ctx.lineTo(cx+30,cy+30); ctx.moveTo(cx+30,cy-30); ctx.lineTo(cx-30,cy+30); ctx.stroke();}
    if(val===2){ctx.strokeStyle='blue'; ctx.beginPath(); ctx.arc(cx,cy,30,0,2*Math.PI); ctx.stroke();}
  }
}
drawBoard();

canvas.addEventListener('click', e=>{
  const rect=canvas.getBoundingClientRect();
  const mx=e.clientX-rect.left;
  const my=e.clientY-rect.top;
  const x=Math.floor(mx/cellSize);
  const y=Math.floor(my/cellSize);
  if(board[y][x]!==0) return;
  board[y][x]=currentPlayer;
  currentPlayer=currentPlayer===1?2:1;
  drawBoard();
});
