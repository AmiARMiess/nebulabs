/* NEBULABS — starfield engine + nav, reveals, counters, parallax (vanilla, no deps) */
(function () {
  /* watchdog: restarts any stalled animation loop */
  var lastTick = performance.now(), rearmed = false, startLoop = null;
  function beat() { lastTick = performance.now(); rearmed = false; }
  function rearm() { if (startLoop && !rearmed) { rearmed = true; startLoop(); } }
  setInterval(function () {
    if (document.visibilityState === 'visible' && performance.now() - lastTick > 1200) rearm();
  }, 400);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') { lastTick = performance.now(); rearm(); }
  });
  addEventListener('focus', rearm);

  try {
    document.documentElement.classList.add('js');

    /* nav state */
    var nav = document.querySelector('.nav');
    addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 8); }, { passive: true });

    /* scroll reveals */
    document.querySelectorAll('h2, .feat, .plan, .term, .cta-card, blockquote').forEach(function (el) { el.classList.add('reveal'); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: .15 });
      document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    }

    /* count-up stats */
    function animateNum(el) {
      var target = parseFloat(el.dataset.target),
          dec = parseInt(el.dataset.decimals || 0, 10),
          suf = el.dataset.suffix || '', t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1500, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * e).toFixed(dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window) {
      var numIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { numIO.unobserve(e.target); animateNum(e.target); } });
      }, { threshold: .6 });
      document.querySelectorAll('.num').forEach(function (el) { numIO.observe(el); });
    } else {
      document.querySelectorAll('.num').forEach(function (el) {
        el.textContent = parseFloat(el.dataset.target).toFixed(parseInt(el.dataset.decimals || 0, 10)) + (el.dataset.suffix || '');
      });
    }

    /* mouse parallax via CSS variables (nebula layer) */
    addEventListener('mousemove', function (e) {
      var mx = (e.clientX / innerWidth - .5) * 2,
          my = -(e.clientY / innerHeight - .5) * 2;
      document.documentElement.style.setProperty('--mx', mx.toFixed(3));
      document.documentElement.style.setProperty('--my', my.toFixed(3));
    }, { passive: true });

    /* footer year */
    var y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();
  } catch (e) {}

  /* ========== CANVAS STARFIELD (runs even if the block above threw) ========== */
  try {
    var canvas = document.getElementById('bg');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var DPR = Math.min(window.devicePixelRatio || 1, 2), W, H;
    function rz() {
      W = canvas.width = innerWidth * DPR;
      H = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
    }
    rz(); addEventListener('resize', rz);

    var stars = [], shots = [], i;
    for (i = 0; i < 240; i++) stars.push({
      x: Math.random(), y: Math.random(),
      r: (Math.random() * 1.3 + .4) * DPR,
      d: Math.random() * .8 + .2,                 /* depth for parallax */
      ph: Math.random() * 6.28, sp: .4 + Math.random() * 1.6,
      tint: i % 9 === 0 ? '255,110,199' : (i % 7 === 0 ? '79,216,235' : '237,235,255')
    });

    var mx = 0, my = 0, tx = 0, ty = 0;
    addEventListener('mousemove', function (e) {
      tx = (e.clientX / innerWidth - .5) * 2;
      ty = -(e.clientY / innerHeight - .5) * 2;
    }, { passive: true });

    function frame(now) {
      beat();
      var t = now / 1000;
      mx += (tx - mx) * .04; my += (ty - my) * .04;
      ctx.clearRect(0, 0, W, H);

      /* stars: twinkle + slow drift + parallax */
      for (var k = 0; k < stars.length; k++) {
        var s = stars[k];
        var a = .25 + .75 * Math.abs(Math.sin(t * s.sp + s.ph));
        var px = (s.x * W + mx * 26 * DPR * s.d + t * 2 * DPR * s.d) % (W + 40) - 20;
        var py = (s.y * H + my * 18 * DPR * s.d) % (H + 40) - 20;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, 7);
        ctx.fillStyle = 'rgba(' + s.tint + ',' + a + ')';
        ctx.fill();
      }

      /* shooting stars */
      if (Math.random() < .006 && shots.length < 3) {
        shots.push({ x: Math.random() * W * .7, y: Math.random() * H * .35,
                     vx: (7 + Math.random() * 6) * DPR, vy: (2.4 + Math.random() * 2) * DPR, life: 1 });
      }
      ctx.globalCompositeOperation = 'lighter';
      for (k = shots.length - 1; k >= 0; k--) {
        var sh = shots[k];
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= .018;
        if (sh.life <= 0 || sh.x > W + 200) { shots.splice(k, 1); continue; }
        var g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 9, sh.y - sh.vy * 9);
        g.addColorStop(0, 'rgba(237,235,255,' + (sh.life * .9) + ')');
        g.addColorStop(1, 'rgba(237,235,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6 * DPR;
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 9, sh.y - sh.vy * 9); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';

      requestAnimationFrame(frame);
    }
    startLoop = function () { requestAnimationFrame(frame); };
    startLoop();
  } catch (e) {}
})();