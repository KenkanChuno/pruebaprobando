const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const PROJ_X = 0.82;
const PROJ_Y = 0.32;

const root = {
  x: W / 2 - 80,
  y: 455
};

const state = {
  jumpY: 0,
  vy: 0,
  grounded: true,
  wait: 12,

  lastJumpY: 0,
  bodyVel: 0,

  bustY: 0,
  bustV: 0,

  hairY: 0,
  hairV: 0,

  blinkFrame: 0,
  blinkCooldown: 90 + Math.floor(Math.random() * 120),
  eyeClosed: false
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function proj(x, y, z) {
  return {
    x: root.x + x + z * PROJ_X,
    y: root.y + state.jumpY + y - z * PROJ_Y
  };
}

function quad(a, b, c, d, color) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.lineTo(d.x, d.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function poly(points, color) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function ellipse(x, y, rx, ry, color, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawBox(x, y, z, w, h, d, colors) {
  const p000 = proj(x, y, z);
  const p100 = proj(x + w, y, z);
  const p110 = proj(x + w, y + h, z);
  const p010 = proj(x, y + h, z);

  const p001 = proj(x, y, z + d);
  const p101 = proj(x + w, y, z + d);
  const p111 = proj(x + w, y + h, z + d);
  const p011 = proj(x, y + h, z + d);

  if (colors.top) {
    quad(p000, p100, p101, p001, colors.top);
  }

  if (colors.side) {
    quad(p100, p101, p111, p110, colors.side);
  }

  if (colors.front) {
    quad(p000, p100, p110, p010, colors.front);
  }

  return {
    frontX: p000.x,
    frontY: p000.y,
    w,
    h,
    z,
    x,
    y,
    d
  };
}

function frontRect(face, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(face.frontX + x, face.frontY + y, w, h);
}

function frontPoly(face, points, color) {
  ctx.beginPath();
  ctx.moveTo(face.frontX + points[0][0], face.frontY + points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(face.frontX + points[i][0], face.frontY + points[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawBackground() {
  ctx.fillStyle = "#cfcfcf";
  ctx.fillRect(0, 0, W, H);
}

function drawShadow() {
  const lift = -state.jumpY;
  const scale = clamp(1 - lift / 90, 0.72, 1);
  const alpha = clamp(0.20 - lift / 500, 0.07, 0.20);

  ctx.save();
  ctx.translate(root.x + 48, root.y + 132);
  ctx.scale(scale, 1);
  ellipse(0, 0, 82, 18, `rgba(0,0,0,${alpha})`);
  ctx.restore();
}

function drawLeftArm() {
  drawBox(-170, -190, 8, 122, 18, 12, {
    front: "#2a2146",
    side: "#1c1532",
    top: "#3c315f"
  });

  drawBox(-178, -190, 8, 8, 18, 12, {
    front: "#efd2bf",
    side: "#d8b89f",
    top: "#f5dccb"
  });
}

function drawRightArm() {
  drawBox(38, -190, 8, 122, 18, 12, {
    front: "#2a2146",
    side: "#1c1532",
    top: "#3c315f"
  });

  drawBox(160, -190, 8, 8, 18, 12, {
    front: "#efd2bf",
    side: "#d8b89f",
    top: "#f5dccb"
  });
}

function drawLegs() {
  const leftLeg = drawBox(-34, -42, 10, 34, 138, 20, {
    front: "#1b1c22",
    side: "#111218",
    top: "#252830"
  });

  const rightLeg = drawBox(2, -42, 10, 34, 138, 20, {
    front: "#17181e",
    side: "#101116",
    top: "#23252c"
  });

  ctx.fillStyle = "rgba(90, 56, 130, 0.25)";
  for (let i = 0; i < 4; i++) {
    frontRect(leftLeg, 0, 54 + i * 14, 34, 6, "rgba(100, 70, 150, 0.22)");
    frontRect(rightLeg, 0, 54 + i * 14, 34, 6, "rgba(100, 70, 150, 0.18)");
  }

  drawBox(-35, 94, 8, 36, 22, 24, {
    front: "#f0f0f0",
    side: "#d8d8d8",
    top: "#ffffff"
  });

  drawBox(1, 94, 8, 36, 22, 24, {
    front: "#f0f0f0",
    side: "#d8d8d8",
    top: "#ffffff"
  });

  ctx.fillStyle = "#261d42";
  ctx.fillRect(leftLeg.frontX + 0, leftLeg.frontY + 136, 36, 4);
  ctx.fillRect(rightLeg.frontX - 1, rightLeg.frontY + 136, 36, 4);

  ctx.fillRect(leftLeg.frontX + 10, leftLeg.frontY + 148, 6, 12);
  ctx.fillRect(leftLeg.frontX + 18, leftLeg.frontY + 148, 6, 12);
  ctx.fillRect(leftLeg.frontX + 10, leftLeg.frontY + 162, 6, 2);
  ctx.fillRect(leftLeg.frontX + 18, leftLeg.frontY + 162, 6, 2);

  ctx.fillRect(rightLeg.frontX + 10, rightLeg.frontY + 148, 6, 12);
  ctx.fillRect(rightLeg.frontX + 18, rightLeg.frontY + 148, 6, 12);
  ctx.fillRect(rightLeg.frontX + 10, rightLeg.frontY + 162, 6, 2);
  ctx.fillRect(rightLeg.frontX + 18, rightLeg.frontY + 162, 6, 2);
}

function drawHipsAndWaist() {
  const hips = drawBox(-36, -92, 8, 72, 54, 28, {
    front: "#0b1013",
    side: "#05080a",
    top: "#1b2025"
  });

  poly(
    [
      proj(-26, -130, 8),
      proj(26, -130, 8),
      proj(18, -95, 8),
      proj(-30, -98, 8)
    ],
    "#efd2bf"
  );

  poly(
    [
      proj(26, -130, 8),
      proj(48, -122, 36),
      proj(40, -91, 36),
      proj(18, -95, 8)
    ],
    "#dcbda3"
  );

  ellipse(
    hips.frontX + 34,
    hips.frontY - 10,
    3,
    2,
    "rgba(80,40,30,0.35)"
  );
}

function drawTorso() {
  const torso = drawBox(-38, -194 + state.bustY * 0.10, 8, 76, 70, 24, {
    front: "#241744",
    side: "#180f2f",
    top: "#37235a"
  });

  frontPoly(
    torso,
    [
      [22, 0],
      [42, 0],
      [36, 17],
      [27, 24],
      [17, 17],
      [17, 0]
    ],
    "#efd2bf"
  );

  const bustLeft = proj(-12, -150 + state.bustY, 4);
  const bustRight = proj(18, -148 + state.bustY, 3);

  ellipse(bustLeft.x, bustLeft.y, 30, 38, "#2f2450", -0.16);
  ellipse(bustRight.x, bustRight.y, 33, 40, "#332756", -0.10);

  ellipse(bustLeft.x - 7, bustLeft.y - 7, 10, 12, "rgba(255,255,255,0.07)", -0.2);
  ellipse(bustRight.x - 8, bustRight.y - 8, 12, 14, "rgba(255,255,255,0.05)", -0.16);
}

function drawNeck() {
  drawBox(6, -208, 10, 18, 12, 8, {
    front: "#d8b394",
    side: "#c39f82",
    top: "#e3c1a5"
  });

  ctx.fillStyle = "#1b1511";
  ctx.fillRect(proj(4, -212, 10).x, proj(4, -212, 10).y, 22, 4);
}

function drawHead() {
  const head = drawBox(-44, -292 + state.hairY * 0.20, 0, 88, 88, 30, {
    front: "#8a664f",
    side: "#6e513f",
    top: "#9d7559"
  });

  frontRect(head, 18, 36, 46, 40, "#efd2bf");

  frontRect(head, 0, 0, 88, 26, "#8a664f");
  frontRect(head, 10, 32, 18, 50, "#6f5241");
  frontRect(head, 12, 65, 12, 12, "#6a4d3e");

  frontRect(head, 8, 18, 12, 12, "#db37a8");
  frontRect(head, -2, 28, 12, 12, "#db37a8");
  frontRect(head, 18, 28, 12, 12, "#db37a8");
  frontRect(head, 8, 38, 12, 12, "#db37a8");
  frontRect(head, 8, 28, 12, 12, "#d8d43a");

  frontRect(head, 28, 48, 10, 3, "#34261d");
  frontRect(head, 46, 46, 10, 3, "#34261d");

  if (state.eyeClosed) {
    frontRect(head, 27, 58, 12, 2, "#3a2d25");
    frontRect(head, 45, 56, 12, 2, "#3a2d25");
  } else {
    frontRect(head, 27, 56, 12, 6, "#72b3ff");
    frontRect(head, 45, 54, 12, 6, "#72b3ff");
  }

  frontRect(head, 41, 64, 2, 8, "rgba(120,90,70,0.25)");
  frontRect(head, 37, 74, 10, 2, "#bc6f79");
}

function drawCharacter() {
  drawLeftArm();
  drawRightArm();
  drawTorso();
  drawHipsAndWaist();
  drawLegs();
  drawNeck();
  drawHead();
}

function updateBlink() {
  state.blinkFrame++;

  if (state.blinkFrame >= state.blinkCooldown) {
    state.eyeClosed = true;
  }

  if (state.blinkFrame >= state.blinkCooldown + 7) {
    state.eyeClosed = false;
    state.blinkFrame = 0;
    state.blinkCooldown = 90 + Math.floor(Math.random() * 120);
  }
}

function updateJump() {
  if (state.grounded) {
    if (state.wait > 0) {
      state.wait--;
    } else {
      state.vy = -5.0;
      state.grounded = false;
    }
  } else {
    state.jumpY += state.vy;
    state.vy += 0.20;

    if (state.jumpY >= 0) {
      state.jumpY = 0;
      state.vy = 0;
      state.grounded = true;
      state.wait = 14;
    }
  }

  state.bodyVel = state.jumpY - state.lastJumpY;
  state.lastJumpY = state.jumpY;
}

function updateSecondaryMotion() {
  state.bustV += (-state.bodyVel * 0.42);
  state.bustV += (-state.bustY * 0.18);
  state.bustV *= 0.76;
  state.bustY += state.bustV;
  state.bustY = clamp(state.bustY, -6, 9);

  state.hairV += (-state.bodyVel * 0.16);
  state.hairV += (-state.hairY * 0.14);
  state.hairV *= 0.82;
  state.hairY += state.hairV;
  state.hairY = clamp(state.hairY, -4, 5);
}

function loop() {
  updateJump();
  updateSecondaryMotion();
  updateBlink();

  drawBackground();
  drawShadow();
  drawCharacter();

  requestAnimationFrame(loop);
}

loop();