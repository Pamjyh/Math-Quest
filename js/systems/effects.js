/**
 * effects.js — Particle System + Cinematic Effects
 * ทุก effect วาดบน canvas ล้วน ไม่ต้องไฟล์เพิ่ม
 */

const Effects = (() => {
  let eCanvas, eCtx;   // effect canvas (over battle)
  let fsEl;            // fullscreen overlay div
  let floatLayer;      // floating damage numbers
  let particles = [];
  let overlays = [];   // full-screen flash/effects
  let shakeX = 0, shakeY = 0, shakeDuration = 0, shakeIntensity = 0;
  let animId = null;
  let active = false;

  // ---- Init ----
  function init() {
    eCanvas   = document.getElementById('effect-canvas');
    fsEl      = document.getElementById('fs-effect');
    floatLayer= document.getElementById('float-layer');
    if (eCanvas) eCtx = eCanvas.getContext('2d');
    active = true;
    _loop();
  }

  function resize(w, h) {
    if (!eCanvas) return;
    eCanvas.width  = w;
    eCanvas.height = h;
  }

  function stop() {
    active = false;
    particles = [];
    overlays  = [];
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    if (eCtx) eCtx.clearRect(0, 0, eCanvas.width, eCanvas.height);
    if (floatLayer) floatLayer.innerHTML = '';
    if (fsEl) { fsEl.style.opacity = 0; fsEl.innerHTML = ''; }
  }

  // ---- Main Loop ----
  function _loop() {
    if (!active) return;
    _update();
    _draw();
    animId = requestAnimationFrame(_loop);
  }

  function _update() {
    // screen shake decay
    if (shakeDuration > 0) {
      shakeDuration -= 16;
      const t = shakeDuration / 400;
      shakeX = (Math.random() - 0.5) * shakeIntensity * t;
      shakeY = (Math.random() - 0.5) * shakeIntensity * t;
      const bc = document.getElementById('battle-canvas');
      if (bc) { bc.style.transform = `translate(${shakeX}px,${shakeY}px)`; }
    } else {
      shakeX = shakeY = 0;
      const bc = document.getElementById('battle-canvas');
      if (bc) bc.style.transform = '';
    }

    // update particles
    particles = particles.filter(p => {
      p.x  += p.vx; p.y  += p.vy;
      p.vx *= p.friction || 0.96;
      p.vy *= p.friction || 0.96;
      p.vy += p.gravity || 0.12;
      p.life -= p.decay;
      p.size *= 0.97;
      return p.life > 0 && p.size > 0.3;
    });

    // update overlays
    overlays = overlays.filter(o => {
      o.alpha -= o.fadeSpeed || 0.03;
      return o.alpha > 0;
    });
  }

  function _draw() {
    if (!eCtx) return;
    eCtx.clearRect(0, 0, eCanvas.width, eCanvas.height);

    overlays.forEach(o => {
      eCtx.save();
      eCtx.globalAlpha = Math.max(0, o.alpha);
      eCtx.fillStyle   = o.color;
      eCtx.fillRect(0, 0, eCanvas.width, eCanvas.height);
      eCtx.restore();
    });

    particles.forEach(p => {
      eCtx.save();
      eCtx.globalAlpha = Math.max(0, p.life);
      eCtx.fillStyle   = p.color;
      if (p.shape === 'star') _drawStar(eCtx, p.x, p.y, p.size);
      else if (p.shape === 'rect') eCtx.fillRect(p.x, p.y, p.size * 2, p.size * 1.5);
      else if (p.shape === 'slash') {
        eCtx.strokeStyle = p.color;
        eCtx.lineWidth   = p.size;
        eCtx.lineCap     = 'round';
        eCtx.beginPath();
        eCtx.moveTo(p.x - p.len * 0.5, p.y + p.len * 0.3);
        eCtx.lineTo(p.x + p.len * 0.5, p.y - p.len * 0.3);
        eCtx.stroke();
      } else if (p.shape === 'ring') {
        eCtx.strokeStyle = p.color;
        eCtx.lineWidth   = Math.max(1, p.size * 0.4);
        eCtx.beginPath();
        eCtx.arc(p.x, p.y, p.radius || p.size * 3, 0, Math.PI * 2);
        eCtx.stroke();
        if (p.radius) p.radius += p.expandSpeed || 4;
      } else if (p.shape === 'bolt') {
        _drawBolt(eCtx, p);
      } else {
        eCtx.beginPath();
        eCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        eCtx.fill();
      }
      // glow
      if (p.glow) {
        eCtx.shadowColor = p.color;
        eCtx.shadowBlur  = p.glow;
      }
      eCtx.restore();
    });
  }

  // ---- Particle Helper ----
  function _spawn(cfg) {
    const { x, y, count = 10, colors, size = 4, sizeVar = 2,
            speed = 4, speedVar = 2, spread = Math.PI * 2,
            angle = 0, gravity = 0.12, life = 35, shape = 'circle',
            glow = 0, friction = 0.96, ...extra } = cfg;
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const s = speed + Math.random() * speedVar;
      particles.push({
        x: x + (Math.random() - 0.5) * (cfg.scatter || 8),
        y: y + (Math.random() - 0.5) * (cfg.scatter || 8),
        vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        gravity, friction,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: size + Math.random() * sizeVar,
        life: 1.0, decay: 1 / (life + Math.random() * 10),
        shape, glow, ...extra,
      });
    }
  }

  function _drawStar(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const b = a + (2 * Math.PI) / 10;
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      ctx.lineTo(x + Math.cos(b) * r * 0.4, y + Math.sin(b) * r * 0.4);
    }
    ctx.closePath(); ctx.fill();
  }

  function _drawBolt(ctx, p) {
    ctx.strokeStyle = p.color;
    ctx.lineWidth = Math.max(1, p.size * 0.5);
    ctx.beginPath();
    let bx = p.x, by = p.y - p.boltLen * 0.5;
    ctx.moveTo(bx, by);
    for (let s = 0; s < 5; s++) {
      bx += (Math.random() - 0.5) * 12;
      by += p.boltLen / 5;
      ctx.lineTo(bx, by);
    }
    ctx.stroke();
  }

  // ---- Screen FX ----
  function flash(color = '#ffffff', alpha = 0.7, fadeSpeed = 0.05) {
    overlays.push({ color, alpha, fadeSpeed });
  }

  function shake(intensity = 6, duration = 400) {
    shakeIntensity = intensity;
    shakeDuration  = duration;
  }

  // ---- Floating Damage Numbers ----
  function floatDamage(x, y, amount, type = 'correct') {
    if (!floatLayer) return;
    const colors = { correct: '#2ecc71', fast: '#f1c40f', wrong: '#e74c3c', miss: '#95a5a6', combo: '#fd79a8' };
    const texts  = { correct: `-${amount}`, fast: `⚡-${amount}`, wrong: `-${amount}`, miss: 'MISS!', combo: `COMBO×${amount}` };
    const el = document.createElement('div');
    el.className = 'float-num';
    el.style.cssText = `
      position:absolute; left:${x}px; top:${y}px;
      color:${colors[type] || '#fff'}; font-size:${type === 'combo' ? 22 : 18}px;
      font-weight:700; font-family:var(--font-sans);
      text-shadow:0 2px 8px rgba(0,0,0,.8);
      pointer-events:none; z-index:50;
      animation: floatUp 1.2s ease-out forwards;
    `;
    el.textContent = texts[type] || `-${amount}`;
    floatLayer.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  // ---- HERO ATTACK EFFECTS ----
  function heroAttack(heroId, tx, ty) {
    const h = {
      warrior(x, y) {
        // Sword slash — golden streak + sparks
        _spawn({ x, y, count: 3, colors: ['#f1c40f','#fff'], size: 6, sizeVar: 2, speed: 0, life: 25, shape: 'slash', scatter: 20, gravity: 0 });
        _spawn({ x, y, count: 14, colors: ['#f1c40f','#e67e22','#fff'], size: 3, speed: 7, speedVar: 3, spread: 0.8, angle: -0.4, gravity: 0.2, life: 20, glow: 8 });
        flash('#f1c40f33', 0.35, 0.08);
      },
      angel(x, y) {
        // Holy rings + white sparkles
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            _spawn({ x, y, count: 1, colors: ['#ffffcc'], size: 2, speed: 0, life: 40, shape: 'ring', scatter: 0, gravity: 0, radius: 10 + i * 15, expandSpeed: 5, glow: 12 });
          }, i * 120);
        }
        _spawn({ x, y, count: 20, colors: ['#fff','#ffffcc','#f1c40f'], size: 3, speed: 4, life: 35, shape: 'star', glow: 6 });
        flash('#ffffff22', 0.4, 0.06);
      },
      giant(x, y) {
        // SHOCKWAVE + heavy particles + full shake
        _spawn({ x, y, count: 1, colors: ['#e67e22'], size: 3, speed: 0, life: 35, shape: 'ring', radius: 5, expandSpeed: 8, gravity: 0, glow: 15 });
        _spawn({ x, y, count: 20, colors: ['#8B4513','#d2691e','#a0522d','#e67e22'], size: 7, sizeVar: 4, speed: 5, speedVar: 3, gravity: 0.4, life: 25, shape: 'rect' });
        shake(12, 600);
        flash('#8B451322', 0.5, 0.05);
      },
      dragon(x, y) {
        // FIRE STREAM — epic full-screen flicker
        _spawn({ x, y, count: 40, colors: ['#e74c3c','#f39c12','#e67e22','#f1c40f','#c0392b'], size: 5, sizeVar: 3, speed: 9, speedVar: 4, spread: 0.5, angle: 0.1, gravity: -0.05, life: 22, glow: 10 });
        _spawn({ x, y, count: 15, colors: ['#f1c40f','#fff'], size: 2, speed: 12, spread: 0.3, angle: 0, gravity: 0, life: 15, glow: 8 });
        flash('#e74c3c44', 0.6, 0.05);
        shake(5, 300);
      },
      fairy(x, y) {
        // Pink sparkles + stars flying everywhere
        _spawn({ x, y, count: 30, colors: ['#fd79a8','#fdcb6e','#e84393','#fff','#b388ff'], size: 3, speed: 5, spread: Math.PI * 2, life: 40, shape: 'star', glow: 8 });
        _spawn({ x, y, count: 10, colors: ['#fd79a8'], size: 2, speed: 0, life: 45, shape: 'ring', radius: 5, expandSpeed: 6, gravity: 0, glow: 10 });
        flash('#fd79a833', 0.45, 0.06);
      },
      indra(x, y) {
        // LIGHTNING — bolts + electric flash
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            _spawn({ x: x + (Math.random()-0.5)*40, y: y - 80, count: 1, colors: ['#4af','#74b9ff','#fff'], size: 3, speed: 0, life: 20, shape: 'bolt', boltLen: 80 + Math.random()*40, gravity: 0 });
          }, i * 80);
        }
        _spawn({ x, y, count: 20, colors: ['#74b9ff','#0984e3','#fff'], size: 3, speed: 8, life: 15, glow: 12 });
        flash('#74b9ff55', 0.7, 0.07);
        shake(6, 350);
      },
      kubera(x, y) {
        // Earth CRUSH — rocks + ground shake
        _spawn({ x, y, count: 20, colors: ['#8B4513','#6B3410','#a0522d','#795548'], size: 8, sizeVar: 5, speed: 5, speedVar: 3, gravity: 0.5, friction: 0.92, life: 30, shape: 'rect' });
        _spawn({ x, y, count: 10, colors: ['#d2691e','#e67e22'], size: 3, speed: 6, life: 20 });
        shake(10, 500);
        flash('#8B451322', 0.45, 0.05);
      },
      legend(x, y) {
        // ULTIMATE — ALL effects combined, full-screen EPIC
        _spawn({ x, y, count: 60, colors: ['#f1c40f','#fd79a8','#74b9ff','#fff','#2ecc71','#e74c3c'], size: 5, sizeVar: 3, speed: 10, speedVar: 5, spread: Math.PI*2, life: 45, glow: 12 });
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            _spawn({ x, y, count: 1, colors: [['#f1c40f','#fd79a8','#74b9ff','#2ecc71','#e74c3c'][i]], size: 3, speed: 0, life: 40, shape: 'ring', radius: i * 20, expandSpeed: 7, gravity: 0, glow: 15 });
          }, i * 100);
        }
        flash('#ffffff', 0.8, 0.04);
        shake(14, 700);
        _epicBurst(x, y);
      },
    };
    if (h[heroId]) h[heroId](tx, ty);
    else h.warrior(tx, ty);
  }

  // ---- ENEMY ATTACK EFFECTS ----
  function enemyAttack(spriteId, tx, ty) {
    const e = {
      slime(x, y) {
        _spawn({ x, y, count: 14, colors: ['#2ecc71','#27ae60','#1abc9c','#0be881'], size: 7, sizeVar: 3, speed: 4, gravity: 0.25, friction: 0.90, life: 22 });
        flash('#2ecc7122', 0.4, 0.07);
      },
      boss_slime(x, y) {
        _spawn({ x, y, count: 25, colors: ['#8e44ad','#9b59b6','#2ecc71','#1e8449'], size: 8, sizeVar: 4, speed: 6, gravity: 0.3, life: 28 });
        shake(7, 400); flash('#8e44ad33', 0.5, 0.06);
      },
      goblin(x, y) {
        _spawn({ x, y, count: 10, colors: ['#e74c3c','#c0392b','#922b21'], size: 3, speed: 7, spread: 0.5, angle: Math.PI, gravity: 0.15, life: 18, shape: 'slash' });
        flash('#e74c3c22', 0.35, 0.08);
      },
      boss_general(x, y) {
        _spawn({ x, y, count: 22, colors: ['#c0392b','#e74c3c','#7b241c','#f39c12'], size: 5, speed: 6, life: 25 });
        shake(9, 450); flash('#c0392b44', 0.55, 0.05);
      },
      dark_knight(x, y) {
        _spawn({ x, y, count: 16, colors: ['#2c3e50','#8e44ad','#c0392b','#4a235a'], size: 4, speed: 6, life: 22 });
        flash('#2c3e5044', 0.45, 0.07);
      },
      boss_demon(x, y) {
        _spawn({ x, y, count: 35, colors: ['#e74c3c','#c0392b','#f39c12','#7b241c'], size: 6, speed: 8, life: 28 });
        flash('#e74c3c66', 0.7, 0.05); shake(11, 550);
      },
      shadow(x, y) {
        _spawn({ x, y, count: 18, colors: ['#8e44ad','#6c3483','#4a235a','#2e1146'], size: 5, speed: 5, life: 30 });
        flash('#2e114444', 0.4, 0.06);
      },
      boss_grand(x, y) {
        _spawn({ x, y, count: 45, colors: ['#6c3483','#4a235a','#2e1146','#f1c40f','#c0392b'], size: 7, speed: 9, life: 35 });
        flash('#6c348366', 0.75, 0.04); shake(13, 650);
        _epicBurst(x, y);
      },
    };
    if (e[spriteId]) e[spriteId](tx, ty);
    else e.slime(tx, ty);
  }

  // ---- CINEMATIC FULL-SCREEN ----
  function bossEntrance(boss, cb) {
    if (!fsEl) { if (cb) cb(); return; }
    fsEl.innerHTML = `
      <div class="fs-boss-bg"></div>
      <div class="fs-boss-content">
        <div class="fs-boss-icon">${boss.isBoss ? '👑' : '⚔️'}</div>
        <div class="fs-boss-name">${boss.name}</div>
        <div class="fs-boss-bar"></div>
      </div>
    `;
    fsEl.style.display = 'flex';
    requestAnimationFrame(() => { fsEl.style.opacity = '1'; });
    setTimeout(() => {
      fsEl.style.opacity = '0';
      setTimeout(() => { fsEl.style.display = 'none'; fsEl.innerHTML = ''; if (cb) cb(); }, 600);
    }, 1800);
  }

  function victory(cb) {
    flash('#f1c40f', 0.6, 0.03);
    shake(4, 300);
    // rain of gold stars
    const W = eCanvas ? eCanvas.width : 800;
    const H = eCanvas ? eCanvas.height : 400;
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        _spawn({ x: Math.random() * W, y: -10, count: 1, colors: ['#f1c40f','#fff','#fdcb6e','#fd79a8'], size: 4, sizeVar: 3, speed: 0, vxFixed: (Math.random()-0.5)*2, vyFixed: 2+Math.random()*3, gravity: 0.05, life: 60, shape: Math.random() > 0.5 ? 'star' : 'circle', glow: 8 });
      }, i * 30);
    }
    if (cb) setTimeout(cb, 2500);
  }

  function comboFlash(count, x, y) {
    floatDamage(x, y - 30, count, 'combo');
    flash('#fd79a833', 0.4, 0.08);
    _spawn({ x, y, count: count * 3, colors: ['#fd79a8','#f1c40f','#fff'], size: 3, speed: 5 + count, spread: Math.PI*2, life: 25, shape: 'star', glow: 8 });
  }

  function _epicBurst(x, y) {
    setTimeout(() => flash('#ffffff', 0.9, 0.035), 100);
    setTimeout(() => flash('#ffffff', 0.5, 0.03), 400);
  }

  // ---- Spawn with fixed vx/vy override ----
  // patch _spawn to support vxFixed/vyFixed
  const _origSpawn = _spawn;

  return {
    init, resize, stop,
    heroAttack, enemyAttack,
    floatDamage,
    flash, shake,
    bossEntrance, victory, comboFlash,
  };
})();
