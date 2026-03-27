const character = document.getElementById("character");
const breastLeft = document.getElementById("breastLeft");
const breastRight = document.getElementById("breastRight");

function blink() {
  character.classList.add("blink");
  setTimeout(() => {
    character.classList.remove("blink");
  }, 120);
}

function randomBlinkLoop() {
  const next = 1400 + Math.random() * 2200;
  setTimeout(() => {
    blink();
    randomBlinkLoop();
  }, next);
}

randomBlinkLoop();

let lastY = 0;
let leftOffsetY = 0;
let rightOffsetY = 0;
let leftVelocityY = 0;
let rightVelocityY = 0;

function animateBreasts() {
  const transform = getComputedStyle(character).transform;
  let currentY = 0;

  if (transform && transform !== "none") {
    const matrix = new DOMMatrixReadOnly(transform);
    currentY = matrix.m42;
  }

  const velocityY = currentY - lastY;
  lastY = currentY;

  leftVelocityY += (-velocityY * 0.16);
  rightVelocityY += (-velocityY * 0.16);

  leftVelocityY += (-leftOffsetY * 0.08);
  rightVelocityY += (-rightOffsetY * 0.08);

  leftVelocityY *= 0.84;
  rightVelocityY *= 0.84;

  leftOffsetY += leftVelocityY;
  rightOffsetY += rightVelocityY;

  breastLeft.style.transform = `translateY(${leftOffsetY}px)`;
  breastRight.style.transform = `translateY(${rightOffsetY}px)`;

  requestAnimationFrame(animateBreasts);
}

animateBreasts();