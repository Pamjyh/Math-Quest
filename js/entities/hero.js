/**
 * hero.js — วาด Hero และ Enemy ด้วย PNG sprites จาก Pic/
 * ใช้ ctx.drawImage() แทน fillRect เดิม
 */

const HeroEntity = (() => {

  // วาด Hero sprite บน canvas
  function draw(ctx, hero, x, y, w, h, state = 'idle', frame = 0) {
    const img = Sprites.get(hero.id);
    _drawSprite(ctx, img, x, y, w, h, state, frame, false);
  }

  // วาด Enemy sprite บน canvas (mirror flip)
  function drawEnemy(ctx, enemy, x, y, w, h, state = 'idle', frame = 0) {
    const img = Sprites.get(enemy.spriteId || enemy.id);
    _drawSprite(ctx, img, x, y, w, h, state, frame, true);
  }

  // ---- core draw ----
  function _drawSprite(ctx, img, x, y, w, h, state, frame, flipX) {
    // รองรับทั้ง HTMLImageElement และ HTMLCanvasElement (จาก removeBg)
    // img.complete ไม่มีใน Canvas → ใช้ width/naturalWidth แทน
    if (!img || !(img.naturalWidth || img.width)) return;

    ctx.save();

    // Hurt: กระพริบแดง
    if (state === 'hurt') {
      if (Math.floor(frame / 3) % 2 === 0) {
        // วาดปกติ
        _blit(ctx, img, x, y, w, h, flipX);
        // ซ้อน tint แดง
        ctx.globalCompositeOperation = 'source-atop';
        ctx.globalAlpha = 0.45;
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x, y, w, h);
      }
      // frame คี่ = ไม่วาด (กระพริบ)
      ctx.restore();
      return;
    }

    // Attack: ขยับเข้าหา
    if (state === 'attack') {
      const shift = flipX ? -w * 0.12 : w * 0.12;
      x += shift;
    }

    // Idle: bob เบาๆ
    if (state === 'idle') {
      y += Math.sin(frame * 0.04) * 3;
    }

    // Glow สีทองเมื่อ speed bonus (state = 'fast')
    if (state === 'fast') {
      ctx.shadowColor = '#f1c40f';
      ctx.shadowBlur = 20;
    }

    _blit(ctx, img, x, y, w, h, flipX);
    ctx.restore();

    // เงาใต้ตัวละคร
    _drawShadow(ctx, x + w / 2, y + h, w * 0.55);
  }

  function _blit(ctx, img, x, y, w, h, flipX) {
    if (flipX) {
      ctx.save();
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(img, x, y, w, h);
    }
  }

  function _drawShadow(ctx, cx, groundY, rx) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(cx, groundY, rx, rx * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ---- UI: Hero Select Screen ----
  function renderSelectScreen() {
    const grid = document.getElementById('hero-grid');
    grid.innerHTML = HEROES.map(h => {
      const unlocked = Progress.isUnlocked(h.id);
      return `
        <div class="hero-card ${unlocked ? 'unlocked' : 'locked'}"
             ${unlocked ? `onclick="Game.selectHero('${h.id}')"` : ''}>
          <div class="hero-emoji">${h.emoji}</div>
          <div class="hero-card-name">${h.name}</div>
          <div class="hero-card-desc">${h.desc}</div>
          <div class="hero-stats">⚔️${h.stats.atk} 🛡️${h.stats.def} ⚡${h.stats.spd}x</div>
          ${!unlocked ? `<div class="lock-badge">🔒 ${h.unlockAt > 500 ? 'เงื่อนไขพิเศษ' : h.unlockAt + '⭐'}</div>` : ''}
        </div>`;
    }).join('');
  }

  // ---- UI: Collection Screen ----
  function renderCollectionScreen() {
    const grid = document.getElementById('collection-grid');
    const save = Progress.get();
    const have = save.unlockedHeroes.length;

    grid.innerHTML = HEROES.map(h => {
      const unlocked = Progress.isUnlocked(h.id);
      return `
        <div class="hero-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="hero-emoji">${unlocked ? h.emoji : '❓'}</div>
          <div class="hero-card-name">${unlocked ? h.name : '???'}</div>
          <div class="hero-card-desc">${unlocked ? h.desc : `สะสม ${h.unlockAt > 500 ? 'เงื่อนไขพิเศษ' : h.unlockAt + '⭐'} เพื่อปลดล็อก`}</div>
        </div>`;
    }).join('');

    document.getElementById('collection-progress').textContent =
      `สะสมแล้ว ${have}/${HEROES.length} ตัวละคร · ⭐ ${save.totalStars} ดาวรวม`;
  }

  return { draw, drawEnemy, renderSelectScreen, renderCollectionScreen };
})();
