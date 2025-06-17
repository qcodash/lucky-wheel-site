const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const slices = ["$100 Gift Card", "Try Again", "$10 Coupon", "Better Luck", "$5 Off", "No Win"];
const colors = ["#f39c12", "#e74c3c", "#1abc9c", "#9b59b6", "#3498db", "#2ecc71"];
const numSlices = slices.length;
const radius = canvas.width / 2;

let currentAngle = 0;
let isSpinning = false;
let winners = [];

const fakeNames = ["Emily", "John", "Sophia", "David", "Liam", "Mia", "Noah", "Olivia", "James", "Ava"];
const winnerBoard = document.getElementById("winnerBoard");

function drawWheel() {
  const arcSize = (2 * Math.PI) / numSlices;
  for (let i = 0; i < numSlices; i++) {
    const startAngle = i * arcSize;
    ctx.beginPath();
    ctx.fillStyle = colors[i];
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, startAngle + arcSize);
    ctx.fill();

    // Text
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + arcSize / 2);
    ctx.fillText(slices[i], radius * 0.6, 0);
    ctx.restore();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);
  ctx.rotate(currentAngle * Math.PI / 180);
  ctx.translate(-radius, -radius);
  drawWheel();
  ctx.restore();
}

function spin() {
  if (isSpinning) return;

  isSpinning = true;

  const arcSize = 360 / numSlices;
  const winningIndex = slices.indexOf("$100 Gift Card");

  // 🧠 Rotate so that the pointer (at 0°) aligns with the center of the winning slice
  const sliceMiddle = winningIndex * arcSize + arcSize / 2;
  const stopAngle = 360 - sliceMiddle - 75;

  // 🎯 Add full spins before stopping
  const fullSpins = 6 * 360;
  const finalAngle = fullSpins + stopAngle;

  const spinTime = 4000;
  const start = performance.now();

  const animate = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinTime, 1);
    currentAngle = finalAngle * easeOut(progress);
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



function easeOut(t) {
  return 1 - Math.pow(1 - t, 4); // smooth deceleration
}

function showResult() {
  const result = "$100 Gift Card"; // always the same result
  document.getElementById("result").innerHTML = `
    🎁 You got: <strong>${result}</strong>!<br>
    <span style="color: green;">Please claim your gift below.</span>
  `;

  // Disable the spin button
  const spinBtn = document.getElementById("spinBtn");
  spinBtn.disabled = true;
  spinBtn.style.opacity = 0.6;
  spinBtn.style.cursor = "not-allowed";
  spinBtn.textContent = "✅ Already Spun";

  // Add to winner board
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

// Initialize
draw();
generateFakeWinners();

// Auto stream fake winners every 7 seconds
setInterval(() => {
  const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
  const prize = slices[Math.floor(Math.random() * slices.length)];
  winners.unshift(`${name} won ${prize}`);
  updateWinnerBoard();
}, 2000);
