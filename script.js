/* ══════════════════════════════
   CANVAS — falling petals
══════════════════════════════ */
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

/* ══════════════════════════════
   LOADER → SCENE
══════════════════════════════ */
setTimeout(() => {
  document.getElementById('loader').classList.add('hide');
  document.getElementById('scene').classList.add('show');
  tick();
}, 2700);

/* ══════════════════════════════
   ENVELOPE
   Логика z-index при открытии:

   Закрыт:  card(1) < flap-bottom(2) < flap-left/right(3) < flap-top(4)
            → письмо закрыто всеми 4 треугольниками

   Открыт:
   1. flap-top начинает rotateX(-180deg)
   2. ~450ms: flap-top face скрывается (backface-visibility:hidden),
      письмо видно через открытый проём
   3. 450ms: письмо начинает двигаться вверх
      ОДНОВРЕМЕННО flap-top.z-index → 0 (ниже письма z=1)
      → письмо перекрывает верхний треугольник при выезде ✓
   4. flap-bottom(2), flap-left/right(3) остаются выше письма(1)
      → нижняя часть письма, пока оно ещё внутри, скрыта ✓
      → создаётся эффект выезда «изнутри конверта»
══════════════════════════════ */
const envelope = document.getElementById('envelope');
const flapTop  = document.getElementById('flap-top');
let openTimer  = null;

envelope.addEventListener('click', function () {
  const opening = !this.classList.contains('open');
  this.classList.toggle('open');

  if (opening) {
    // Открытие: в момент старта движения письма (delay 0.45s)
    // роняем z-index верхнего треугольника ниже письма (z=0 < card z=1)
    openTimer = setTimeout(() => flapTop.classList.add('above-card'), 450);
  } else {
    // Закрытие: above-card держим пока карточка видна над конвертом,
    // но снимаем ДО того как она займёт финальную позицию.
    // К 1200ms флап уже ~82% закрыт и перекроет карточку сверху,
    // карточка ещё в пути — нет артефакта "карточка поверх флапа".
    clearTimeout(openTimer);
    openTimer = setTimeout(() => flapTop.classList.remove('above-card'), 1200);
  }
});
