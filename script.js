const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const slices = ["$100 Gift Card", "Try Again", "$10 Coupon", "Better Luck", "$5 Off", "No Win"];
const colors = ["#f39c12", "#e74c3c", "#1abc9c", "#9b59b6", "#3498db", "#2ecc71"];
const numSlices = slices.length;
const radius = canvas.width / 2;

let angle = 0;
let isSpinning = false;
let winners = [];

const fakeNames = ["Emily", "John", "Sophia", "David", "Liam", "Mia", "Noah", "Olivia", "James", "Ava"];
const winnerBoard = document.getElementById("winnerBoard");

// Draw the initial wheel
function drawWheel() {
  const arcSize = (2 * Math.PI) / numSlices;
  for (let i = 0; i < numSlices; i++) {
    const startAngle = i * arcSize;
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, startAngle + arcSize);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + arcSize / 2);
    ctx.fillText(slices[i], radius / 2, 0);
    ctx.restore();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.translate(-radius, -radius);
  drawWheel();
  ctx.restore();
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spin() {
  if (isSpinning) return;

  isSpinning = true;
  const spinAngle = Math.random() * 360 + 1080; // spin at least 3 times
  const spinTime = 4000; // in ms

  const start = performance.now();
  const animate = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinTime, 1);
    angle = spinAngle * easeOut(progress);

    draw();
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      isSpinning = false;
      showResult();
    }
  };

  requestAnimationFrame(animate);
}

function showResult() {
  const degrees = angle % 360;
  const arcSize = 360 / numSlices;
  const index = Math.floor((360 - degrees) / arcSize) % numSlices;
  const result = slices[index];

  document.getElementById("result").textContent = `🎁 You got: ${result}!`;

  const user = `You`;
  winners.unshift(`${user} won ${result}`);
  updateWinnerBoard();
}

function updateWinnerBoard() {
  winnerBoard.innerHTML = "";
  winners.slice(0, 10).forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1}: ${entry}`;
    winnerBoard.appendChild(li);
  });
}

function generateFakeWinners(count = 10) {
  for (let i = 0; i < count; i++) {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const prize = slices[Math.floor(Math.random() * slices.length)];
    winners.push(`${name} won ${prize}`);
  }
  updateWinnerBoard();
}

// Initialize on load
draw();
generateFakeWinners();
