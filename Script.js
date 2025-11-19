let board = [1,2,3,4,5,6,7,8,0], solved = "1,2,3,4,5,6,7,8,0";
const puzzle = document.getElementById("puzzle"),
      message = document.getElementById("message"),
      shuffleBtn = document.getElementById("shuffleBtn"),
      confettiCanvas = document.getElementById("confetti");

function render() {
  puzzle.innerHTML = "";
  board.forEach((num, idx) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (num === 0) {
      tile.classList.add("blank");
      tile.innerHTML = "";
    } else {
      tile.textContent = num;
      tile.onclick = () => move(idx);
    }
    puzzle.appendChild(tile);
  });
  if (isSolved()) {
    message.textContent = "🎉 Congratulations! Puzzle solved!";
    blastConfetti();
  } else {
    message.textContent = "";
  }
}

function move(idx) {
  const adjacents = [idx-3, idx+3, idx%3!==0?idx-1:-1, idx%3!==2?idx+1:-1];
  const zeroIdx = board.indexOf(0);
  if (adjacents.includes(zeroIdx)) {
    [board[zeroIdx], board[idx]] = [board[idx], board[zeroIdx]];
    render();
  }
}

function shuffle() {
  for (let i = 0; i < 100; i++) {
    const moves = getMovable();
    const randomIdx = moves[Math.floor(Math.random()*moves.length)];
    move(randomIdx);
  }
  message.textContent = "";
  hideConfetti();
}

function getMovable() {
  const zeroIdx = board.indexOf(0);
  const adjacents = [zeroIdx-3, zeroIdx+3, zeroIdx%3!==0?zeroIdx-1:-1, zeroIdx%3!==2?zeroIdx+1:-1];
  return adjacents.filter(i=>i>=0&&i<9);
}

function isSolved() {
  return board.join() === solved;
}

// Confetti Blast (simple)
function blastConfetti() {
  confettiCanvas.style.display = "block";
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  let ctx = confettiCanvas.getContext("2d");
  let pieces = [];
  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random()*confettiCanvas.width, y: Math.random()*-40,
      w: 6 + Math.random()*10, h: 15 + Math.random()*10,
      dx: (Math.random()-0.5)*4, dy: 2 + Math.random()*6,
      color: `hsl(${Math.floor(Math.random()*360)},90%,60%)`,
      angle: Math.random()*2*Math.PI
    });
  }
  let frames = 0;
  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach((p, i) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle + frames*0.03);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
      p.x += p.dx;
      p.y += p.dy;
      if (p.y > confettiCanvas.height + 40) {
        p.x = Math.random()*confettiCanvas.width;
        p.y = Math.random()*-20;
      }
    });
    frames++;
    if (frames < 120) { // Show for two seconds
      requestAnimationFrame(draw);
    } else {
      hideConfetti();
    }
  }
  draw();
}
function hideConfetti() { confettiCanvas.style.display = "none"; }

shuffleBtn.onclick = shuffle;
window.addEventListener('resize', ()=>{confettiCanvas.width=window.innerWidth;confettiCanvas.height=window.innerHeight;});
render();
