/**
 * battle.js — ฉากการต่อสู้หลัก
 * Canvas rendering + Timer + Question logic + Animation
 * v2: Integrated Effects + Cutscene (combo, boss entrance, victory)
 */

const BattleScene = (() => {
  let canvas, ctx;
  let mode, hero, stage;
  let heroHP, heroMaxHP, enemyHP, enemyMaxHP;
  let enemy;
  let score = 0;
  let correct = 0, total = 0;
  let currentQuestion = null;
  let choices = [];
  let timerInterval = null;
  let timeLeft = 0;
  let maxTime = 12;
  let animState = { hero: 'idle', enemy: 'idle' };
  let animFrame = 0;
  let animTick = null;
  let paused = false;
  let comboCount = 0;                           // combo counter
  let midShown = false;                         // mid-battle cutscene (ต่อ stage)
  let heroPos  = { x: 0, y: 0, w: 0, h: 0 };  // live position for effects
  let enemyPos = { x: 0, y: 0, w: 0, h: 0 };  // live position for effects

  const BG_KEY   = { p1: 'bg_p1', p4: 'bg_p4', p5: 'bg_p5', p6: 'bg_p6' };
  const BOSS_KEY = { p1: 'boss_p1', p4: 'boss_p4', p5: 'boss_p5', p6: 'boss_p6' };
  const MID_KEY  = { p1: 'mid_p1',  p4: 'mid_p4',  p5: 'mid_p5',  p6: 'mid_p6' };
  const WIN_KEY  = { p1: 'victory_p1', p4: 'victory_p4', p5: 'victory_p5', p6: 'victory_p6' };

  // ---- เริ่มต่อสู้ ----
  function start(opts) {
    mode  = opts.mode;
    hero  = opts.hero;
    stage = opts.stage;

    canvas = document.getElementById('battle-canvas');
    resizeCanvas();
    ctx = canvas.getContext('2d');

    enemy      = EnemyEntity.getForStage(mode, stage);
    heroMaxHP  = CONFIG.heroHP[mode] + hero.stats.def;
    enemyMaxHP = CONFIG.enemyHPBase[mode] + stage * 10;
    heroHP     = heroMaxHP;
    enemyHP    = enemyMaxHP;
    score      = 0;
    correct    = 0;
    total      = 0;
    paused     = false;
    comboCount = 0;
    midShown   = false;

    // Init effect layer (stop ก่อนเพื่อป้องกัน double animation loop)
    Effects.stop();
    Effects.init();
    Effects.resize(canvas.width, canvas.height);

    startAnimLoop();

    // Boss stage → cutscene → bossEntrance → battle
    if (enemy.isBoss) {
      Cutscene.show(BOSS_KEY[mode] || 'boss_p1', () => {
        updateHUD();
        Effects.bossEntrance(enemy, () => nextQuestion());
      }, BG_KEY[mode]);
    } else {
      updateHUD();
      nextQuestion();
    }
  }

  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || Math.min(320, Math.floor(window.innerHeight * 0.38));
    if (typeof Effects !== 'undefined') Effects.resize(canvas.width, canvas.height);
  }

  // ---- Animation Loop ----
  function startAnimLoop() {
    if (animTick) cancelAnimationFrame(animTick);
    window._battleResize = () => { resizeCanvas(); };
    window.removeEventListener('resize', window._battleResize);
    window.addEventListener('resize', window._battleResize);

    let frame = 0;
    function tick() {
      frame++;
      animFrame = frame;
      renderCanvas();
      animTick = requestAnimationFrame(tick);
    }
    tick();
  }

  function stopAnimLoop() {
    if (animTick) cancelAnimationFrame(animTick);
    animTick = null;
  }

  // ---- วาด Canvas ----
  function renderCanvas() {
    if (!ctx) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background
    const worldKey = _getWorldKey();
    const bgImg = Sprites.get(worldKey);
    if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, W, H);
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(0, H * 0.72, W, H * 0.28);
    } else {
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#0a0a1a');
      sky.addColorStop(0.7, '#16213e');
      sky.addColorStop(1, '#1a3a5e');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#0f3460';
      ctx.fillRect(0, H * 0.80, W, H * 0.20);
      ctx.fillStyle = '#1a4a7a';
      ctx.fillRect(0, H * 0.80, W, 4);
      const stars = [[30,18],[90,32],[160,12],[220,42],[300,22],[400,8],[460,38],[530,18],[600,30],[660,10]];
      ctx.fillStyle = '#ffffff';
      stars.forEach(([sx, sy]) => {
        ctx.globalAlpha = 0.4 + (Math.sin(animFrame * 0.05 + sx) > 0.7 ? 0.6 : 0);
        ctx.fillRect(sx % W, sy, 2, 2);
      });
      ctx.globalAlpha = 1;
    }

    // ---- ขนาดตัวละคร ----
    const spriteH = Math.floor(H * 0.60);
    const spriteW = spriteH;
    const bossH   = Math.floor(H * 0.72);
    const bossW   = bossH;
    const groundY = H * 0.80;

    // Hero (ซ้าย)
    const hW = spriteW, hH = spriteH;
    const hX = Math.floor(W * 0.08);
    const hY = Math.floor(groundY - hH);
    HeroEntity.draw(ctx, hero, hX, hY, hW, hH, animState.hero, animFrame);
    heroPos = { x: hX, y: hY, w: hW, h: hH };   // track for effects

    // Enemy (ขวา, flip)
    const isB = enemy.isBoss;
    const eW  = isB ? bossW : spriteW;
    const eH  = isB ? bossH : spriteH;
    const eX  = Math.floor(W * 0.92 - eW);
    const eY  = Math.floor(groundY - eH);
    HeroEntity.drawEnemy(ctx, enemy, eX, eY, eW, eH, animState.enemy, animFrame);
    enemyPos = { x: eX, y: eY, w: eW, h: eH };  // track for effects
  }

  function _getWorldKey() {
    // ใช้ background ตาม mode ปัจจุบัน (bg_p1–p6)
    return BG_KEY[mode] || null;
  }

  // ---- โจทย์ ----
  function nextQuestion() {
    stopTimer();
    const diff = MathSystem.getDifficulty(stage);
    currentQuestion = MathSystem.generateQuestion(mode, diff);
    choices = MathSystem.buildChoices(currentQuestion, mode);
    total++;

    document.getElementById('question-text').textContent = currentQuestion.q;

    const grid = document.getElementById('choices-grid');
    grid.innerHTML = choices.map((c) =>
      `<button class="choice-btn" onclick="BattleScene.answer(${c})">${c}</button>`
    ).join('');

    maxTime = CONFIG.timer[mode];
    startTimer();
  }

  function startTimer() {
    timeLeft = maxTime;
    updateTimerBar(1);
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerBar(timeLeft / maxTime);
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        onTimeout();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function updateTimerBar(ratio) {
    const fill = document.getElementById('timer-fill');
    fill.style.width = (ratio * 100) + '%';
    fill.style.background = ratio > 0.5 ? '#2ecc71' : ratio > 0.25 ? '#f39c12' : '#e74c3c';
  }

  // ---- ตอบคำถาม ----
  function answer(val) {
    if (paused) return;
    stopTimer();
    disableChoices();

    const isCorrect = MathSystem.check(val, currentQuestion);
    const fast = timeLeft >= (maxTime - CONFIG.speedBonusThreshold);

    if (isCorrect) {
      correct++;
      const dmg   = fast ? CONFIG.damage.correctFast : CONFIG.damage.correct;
      const bonus = fast ? hero.stats.atk * 0.5 : 0;
      const totalDmg = Math.floor(dmg + bonus);
      enemyHP = Math.max(0, enemyHP - totalDmg);
      score  += fast ? 150 : 100;

      // Effects: hero attacks enemy
      comboCount++;
      Effects.heroAttack(
        hero.id,
        enemyPos.x + enemyPos.w * 0.5,
        enemyPos.y + enemyPos.h * 0.3
      );
      Effects.floatDamage(
        enemyPos.x + enemyPos.w * 0.5,
        enemyPos.y + 20,
        totalDmg,
        fast ? 'fast' : 'correct'
      );
      if (comboCount >= 5 && comboCount % 5 === 0) {
        Effects.comboFlash(comboCount, heroPos.x + heroPos.w * 0.5, heroPos.y);
      }

      showFeedback(fast ? `⚡ FAST! -${totalDmg}` : `✅ ถูก! -${totalDmg}`, 'correct');
      Audio.correct();
      triggerAnim('hero', 'attack', () => triggerAnim('enemy', 'hurt'));

    } else {
      const dmg = CONFIG.damage.wrong;
      heroHP = Math.max(0, heroHP - dmg);
      comboCount = 0;

      // Effects: enemy attacks hero
      Effects.enemyAttack(
        enemy.spriteId,
        heroPos.x + heroPos.w * 0.5,
        heroPos.y + heroPos.h * 0.3
      );
      Effects.floatDamage(
        heroPos.x + heroPos.w * 0.5,
        heroPos.y + 20,
        dmg,
        'wrong'
      );

      showFeedback(`❌ ผิด! (${currentQuestion.a})`, 'wrong');
      Audio.wrong();
      triggerAnim('enemy', 'attack', () => triggerAnim('hero', 'hurt'));
    }

    updateHUD();
    setTimeout(checkBattleEnd, CONFIG.anim.attack + CONFIG.anim.damage + 200);
  }

  function onTimeout() {
    if (paused) return;
    disableChoices();
    const dmg = CONFIG.damage.miss;
    heroHP = Math.max(0, heroHP - dmg);
    comboCount = 0;

    // Effects: enemy attacks hero (miss)
    Effects.enemyAttack(
      enemy.spriteId,
      heroPos.x + heroPos.w * 0.5,
      heroPos.y + heroPos.h * 0.3
    );
    Effects.floatDamage(
      heroPos.x + heroPos.w * 0.5,
      heroPos.y + 20,
      dmg,
      'miss'
    );

    showFeedback(`⏰ หมดเวลา! (${currentQuestion.a})`, 'timeout');
    Audio.wrong();
    triggerAnim('enemy', 'attack', () => triggerAnim('hero', 'hurt'));
    updateHUD();
    setTimeout(checkBattleEnd, CONFIG.anim.attack + CONFIG.anim.damage + 200);
  }

  function disableChoices() {
    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  }

  function checkBattleEnd() {
    if (enemyHP <= 0) {
      stopAnimLoop();
      Audio.levelUp();
      Effects.victory();  // ฝนดาวทอง

      const accuracy = Math.round((correct / total) * 100);
      const stars = accuracy >= CONFIG.stars.three ? 3
                  : accuracy >= CONFIG.stars.two   ? 2
                  : accuracy >= CONFIG.stars.one   ? 1 : 0;
      const gained = Progress.recordResult({ mode, stage, stars, score });

      // ด่านสุดท้ายของ mode → victory cutscene ก่อนแสดงผล
      const isLastStage = stage >= CONFIG.stagesPerMode - 1;
      const delay = isLastStage ? 2600 : 600;

      setTimeout(() => {
        if (isLastStage && WIN_KEY[mode]) {
          Cutscene.show(WIN_KEY[mode], () => {
            Game.showResult({ win: true, stars, score, accuracy, correct, total, gained });
          }, BG_KEY[mode]);
        } else {
          Game.showResult({ win: true, stars, score, accuracy, correct, total, gained });
        }
      }, delay);

    } else if (heroHP <= 0) {
      stopAnimLoop();
      Audio.gameOver();
      const accuracy = Math.round((correct / total) * 100);
      setTimeout(() => {
        Game.showResult({ win: false, stars: 0, score, accuracy, correct, total, gained: 0 });
      }, 600);
    } else {
      // Mid-battle cutscene: เมื่อ HP ศัตรู < 50% บนด่าน Boss ครั้งแรก
      if (!midShown && enemy.isBoss && enemyHP < enemyMaxHP * 0.5) {
        midShown = true;
        const midKey = MID_KEY[mode];
        if (midKey && typeof STORY !== 'undefined' && STORY[midKey]) {
          Cutscene.show(midKey, () => nextQuestion(), BG_KEY[mode]);
        } else {
          setTimeout(nextQuestion, 400);
        }
      } else {
        setTimeout(nextQuestion, 400);
      }
    }
  }

  // ---- Animation helper ----
  function triggerAnim(target, state, cb) {
    animState[target] = state;
    setTimeout(() => {
      animState[target] = 'idle';
      if (cb) cb();
    }, CONFIG.anim.attack);
  }

  // ---- Feedback overlay ----
  function showFeedback(msg, type) {
    const el = document.getElementById('battle-feedback');
    el.textContent = msg;
    el.className = `battle-feedback show ${type}`;
    setTimeout(() => el.classList.remove('show'), CONFIG.anim.feedback);
  }

  // ---- HUD ----
  function updateHUD() {
    document.getElementById('hud-hero-name').textContent  = hero.name;
    document.getElementById('hud-enemy-name').textContent = enemy.name;
    document.getElementById('hero-hp-text').textContent   = `${heroHP}/${heroMaxHP}`;
    document.getElementById('enemy-hp-text').textContent  = `${enemyHP}/${enemyMaxHP}`;
    document.getElementById('hero-hp-fill').style.width   = (heroHP / heroMaxHP * 100) + '%';
    document.getElementById('enemy-hp-fill').style.width  = (enemyHP / enemyMaxHP * 100) + '%';
    document.getElementById('hud-stage').textContent      = `ด่าน ${stage + 1}/${CONFIG.stagesPerMode}`;
    document.getElementById('hud-score').textContent      = `⭐ ${score}`;
  }

  function pause() {
    paused = !paused;
    if (paused) stopTimer();
    else startTimer();
  }

  function stop() {
    stopAnimLoop();
    stopTimer();
    Effects.stop();
    window.removeEventListener('resize', window._battleResize);
  }

  return { start, answer, pause, stop };
})();
