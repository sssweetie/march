const canvas = document.getElementById('canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = [
  '#ff6b9d', '#ff8fab', '#ffb3c6', '#ffd6e7',
  '#e0aaff', '#c77dff', '#ff7eb3', '#f4a0c0',
];

function makePetal(init) {
  return {
    x:     Math.random() * canvas.width,
    y:     init ? Math.random() * canvas.height : -15,
    rx:    Math.random() * 9 + 4,
    ry:    Math.random() * 5 + 2,
    rot:   Math.random() * Math.PI * 2,
    rotV:  (Math.random() - 0.5) * 0.03,
    vx:    (Math.random() - 0.5) * 0.8,
    vy:    Math.random() * 1.3 + 0.4,
    alpha: Math.random() * 0.5 + 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    t:     Math.random() * Math.PI * 2,
    sway:  Math.random() * 1.6 + 0.3,
  };
}

const petals = Array.from({ length: 90 }, () => makePetal(true));

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of petals) {
    p.t   += 0.016;
    p.y   += p.vy;
    p.x   += p.vx + Math.sin(p.t) * p.sway * 0.35;
    p.rot += p.rotV;
    if (p.y > canvas.height + 15) Object.assign(p, makePetal(false));

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
  }
  requestAnimationFrame(tick);
}

setTimeout(() => {
  document.getElementById('loader').classList.add('hide');
  document.getElementById('scene').classList.add('show');
  tick();
}, 2700);

const envelope = document.getElementById('envelope');
const flapTop  = document.getElementById('flap-top');
let openTimer  = null;

envelope.addEventListener('click', function () {
  const opening = !this.classList.contains('open');
  this.classList.toggle('open');

  if (opening) {
    openTimer = setTimeout(() => {
      flapTop.classList.add('above-card');
      envelope.classList.add('card-flying');
    }, 440);
  } else {
    clearTimeout(openTimer);
    envelope.classList.remove('card-flying');
    openTimer = setTimeout(() => flapTop.classList.remove('above-card'), 1200);
  }
});
