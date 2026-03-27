const heart = document.getElementById("heart");

const TEXT = "I love you";
const TOTAL = 90; // menos elementos = mejor rendimiento

const centerX = 210;
const centerY = 210;
const scale = 11;

const words = [];

function heartPoint(t, s = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return {
    x: x * s,
    y: -y * s
  };
}

for (let i = 0; i < TOTAL; i++) {
  const span = document.createElement("span");
  span.className = "word";
  span.textContent = TEXT;
  heart.appendChild(span);
  words.push(span);
}

function animate(time) {
  const seconds = time * 0.001;

  for (let i = 0; i < TOTAL; i++) {
    const el = words[i];

    const progress = i / TOTAL;
    const t = (progress * Math.PI * 2 + seconds * 0.7) % (Math.PI * 2);

    const p1 = heartPoint(t, scale);
    const p2 = heartPoint(t + 0.03, scale);

    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

    // leve ilusión de profundidad sin blur
    const depth = (Math.sin(t * 2 + seconds * 2) + 1) / 2;
    const size = 0.8 + depth * 0.35;
    const opacity = 0.45 + depth * 0.55;

    const x = centerX + p1.x;
    const y = centerY + p1.y;

    el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${angle}deg) scale(${size})`;
    el.style.opacity = opacity;
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);