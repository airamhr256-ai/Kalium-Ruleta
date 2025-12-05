let tickSound = new Audio("tick.mp3");
tickSound.volume = 0.4;

// Desbloquear audio en Chrome
document.addEventListener("click", function unlockAudio() {
    tickSound.play().catch(() => {}); // Primera reproducción "silenciosa"
    tickSound.pause();
    tickSound.currentTime = 0;
    document.removeEventListener("click", unlockAudio);
});

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const spinBtn = document.getElementById("spinBtn");

const playersList = document.getElementById("players");
const nameInput = document.getElementById("nameInput");

const resultBox = document.getElementById("resultBox");
const winnerNameEl = document.getElementById("winnerName");

let players = [];
let angle = 0;        // 🔥 nunca se reinicia
let isSpinning = false;

// Colores
const colors = ["#00d4ff", "#b14cff", "#3b82f6", "#10b981", "#f43f5e"];

// -------------------- UI --------------------
addBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (!name) return;

  players.push(name);
  nameInput.value = "";
  updateList();
  drawWheel();
};

clearBtn.onclick = () => {
  players = [];
  updateList();
  drawWheel();
  resultBox.style.display = "none";
};

// -------------------- LISTA --------------------
function updateList() {
  playersList.innerHTML = "";
  players.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${p} <button onclick="removePlayer(${i})">X</button>`;
    playersList.appendChild(li);
  });
}

function removePlayer(i) {
  players.splice(i, 1);
  updateList();
  drawWheel();
}

// -------------------- RULETA --------------------
function drawWheel() {
  const size = canvas.width;
  const radius = size / 2;

  ctx.clearRect(0, 0, size, size);

  if (players.length === 0) return;

  const slice = (2 * Math.PI) / players.length;

  for (let i = 0; i < players.length; i++) {
    const start = i * slice;
    const end = start + slice;

    ctx.fillStyle = colors[i % colors.length];

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, start + angle, end + angle);
    ctx.fill();

    ctx.strokeStyle = "#101323";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + slice / 2 + angle);

    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 6;

    ctx.fillText(players[i], radius * 0.55, 8);

    ctx.restore();
  }
}

// -------------------- GIRO --------------------
spinBtn.onclick = () => {
  if (!players.length || isSpinning) return;

  isSpinning = true;
  let speed = 0.25;
  const slowDown = 0.985;

  const spin = () => {
    angle += speed;   // 🔥 nunca se reinicia
    drawWheel();

    speed *= slowDown;

    if (speed > 0.002) {
      requestAnimationFrame(spin);
    } else {
      pickWinner();
      isSpinning = false;
    }
  };

  spin();
};

// -------------------- GANADOR --------------------
function pickWinner() {
  const slice = (2 * Math.PI) / players.length;

  const normalized = (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI);
  const index = Math.floor(normalized / slice);

  const winner = players[index];

  winnerNameEl.textContent = winner;
  resultBox.style.display = "block";

  // 🔥 ELIMINAR GANADOR SIN RESET ANGLE
  players.splice(index, 1);

  updateList();
  drawWheel(); // se mantiene el mismo ángulo
}

// Inicial
drawWheel();


