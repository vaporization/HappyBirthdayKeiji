// ====== QUICK PERSONALIZATION ======
const FRIEND_NAME = "Keiji"; // change this if needed

// Put personal inside jokes here. Keep them friendly.
const reasonPool = [
  "You always show up when it matters.",
  "Your humor is elite (sometimes criminal).",
  "You make boring nights turn into stories.",
  "You’ve got that rare combo: chill + driven.",
  "You’re the type of friend people keep for life.",
  "Your taste in music is suspiciously good.",
  "You’re impossible to stay mad at.",
  "You hype your friends up instead of competing with them.",
  "You have main-character confidence (in a good way).",
  "You’re the glue in the group.",
  "You can take a joke AND dish one back.",
  "You’re the guy I’d call if stuff went sideways.",
  "You make people feel included.",
  "You’re lowkey smart as hell.",
  "You’ve got good instincts.",
  "You’re built for big wins this year.",
  "You’re reliable — which is rare.",
  "You’re fun without being fake.",
  "You’ve got standards (also rare).",
  "You’re genuinely a good person.",
  "Because tonight is your night. Period."
];

const toastPool = [
  "To Keiji — may your year be loud laughs, good friends, and zero regrettable screenshots.",
  "To 21 — may your bank account survive and your memories be legendary.",
  "To Keiji — may your next chapter be bigger, brighter, and slightly more responsible.",
  "To the birthday boy — may your good luck be constant and your hangovers be fictional.",
  "To Keiji — more wins, fewer worries, and friends who always have your back."
];

// ====== DOM ======
document.getElementById("name").textContent = FRIEND_NAME;

const reasonsEl = document.getElementById("reasons");
const popBtn = document.getElementById("popBtn");
const reasonsBtn = document.getElementById("reasonsBtn");
const newToastBtn = document.getElementById("newToastBtn");
const toastEl = document.getElementById("toast");
const copyToastBtn = document.getElementById("copyToastBtn");
const copyReasonsBtn = document.getElementById("copyReasonsBtn");

// ====== TOAST ======
function randomItem(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

newToastBtn.addEventListener("click", () => {
  toastEl.textContent = randomItem(toastPool);
  popConfettiBurst();
});

copyToastBtn.addEventListener("click", async () => {
  await copyText(toastEl.textContent);
  flashButton(copyToastBtn, "Copied ✅");
});

// ====== 21 REASONS ======
reasonsBtn.addEventListener("click", () => {
  reasonsEl.innerHTML = "";
  const reasons = build21Reasons();
  reasons.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    reasonsEl.appendChild(li);
  });
  popConfettiBurst();
});

copyReasonsBtn.addEventListener("click", async () => {
  const items = [...reasonsEl.querySelectorAll("li")].map((li, i) => `${i+1}. ${li.textContent}`);
  if (!items.length) {
    flashButton(copyReasonsBtn, "Generate first 🙂");
    return;
  }
  await copyText(items.join("\n"));
  flashButton(copyReasonsBtn, "Copied ✅");
});

function build21Reasons(){
  // shuffle pool (safe copy)
  const pool = [...reasonPool];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // ensure exactly 21
  const out = pool.slice(0, 21);
  while (out.length < 21) out.push("Because you’re you.");
  return out;
}

// ====== CONFETTI ======
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let W, H;

function resize(){
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  W = canvas.width = Math.floor(window.innerWidth * dpr);
  H = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

let particles = [];
let animating = false;

function popConfettiBurst(){
  const count = 180;
  const originX = window.innerWidth * (0.35 + Math.random() * 0.3);
  const originY = window.innerHeight * 0.25;

  for (let i = 0; i < count; i++){
    particles.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() * -10) - 4,
      g: 0.22 + Math.random() * 0.08,
      size: 4 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      life: 80 + Math.random() * 40,
      color: randomConfettiColor()
    });
  }

  if (!animating) {
    animating = true;
    requestAnimationFrame(tick);
  }
}

function randomConfettiColor(){
  const palette = [
    "#8b5cf6", "#22c55e", "#60a5fa", "#f59e0b", "#fb7185", "#a78bfa", "#34d399"
  ];
  return palette[Math.floor(Math.random() * palette.length)];
}

function tick(){
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles = particles.filter(p => p.life > 0);

  for (const p of particles){
    p.life -= 1;
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 80));
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 1.4);
    ctx.restore();
  }

  if (particles.length > 0) {
    requestAnimationFrame(tick);
  } else {
    animating = false;
  }
}

popBtn.addEventListener("click", popConfettiBurst);
document.addEventListener("click", (e) => {
  // subtle confetti on background taps (not on buttons)
  if (e.target.closest("button")) return;
  if (Math.random() < 0.25) popConfettiBurst();
});

// ====== UTIL ======
async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
  } catch (e){
    // fallback for older mobile browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
}

function flashButton(btn, msg){
  const old = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => btn.textContent = old, 900);
}

// Start with a tiny celebration on load
setTimeout(popConfettiBurst, 450);
