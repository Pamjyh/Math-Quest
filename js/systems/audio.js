/**
 * audio.js — ระบบเสียง 8-bit สังเคราะห์ด้วย Web Audio API
 * ไม่ต้องโหลดไฟล์เสียงภายนอก — ทำงาน Offline ได้ 100%
 */

const Audio = (() => {
  let ctx = null;
  let muted = false;

  function init() {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // สังเคราะห์เสียง 8-bit แบบง่าย
  function beep({ freq = 440, type = 'square', duration = 0.15, vol = 0.3, delay = 0 } = {}) {
    if (!ctx || muted) return;
    resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.01);
  }

  // ---- เสียงเฉพาะ ----

  function correct() {
    // เสียงถูก: โน้ตขึ้น
    beep({ freq: 523, duration: 0.1 });
    beep({ freq: 659, duration: 0.1, delay: 0.1 });
    beep({ freq: 784, duration: 0.15, delay: 0.2 });
  }

  function wrong() {
    // เสียงผิด: โน้ตลง ต่ำ
    beep({ freq: 220, type: 'sawtooth', duration: 0.2 });
    beep({ freq: 180, type: 'sawtooth', duration: 0.2, delay: 0.15 });
  }

  function attack() {
    beep({ freq: 300, type: 'square', duration: 0.08 });
    beep({ freq: 400, type: 'square', duration: 0.08, delay: 0.05 });
  }

  function hit() {
    beep({ freq: 150, type: 'sawtooth', duration: 0.12 });
  }

  function levelUp() {
    [523, 659, 784, 1047].forEach((f, i) =>
      beep({ freq: f, duration: 0.15, delay: i * 0.12 })
    );
  }

  function gameOver() {
    [400, 350, 300, 220].forEach((f, i) =>
      beep({ freq: f, type: 'sawtooth', duration: 0.2, delay: i * 0.18 })
    );
  }

  function menuClick() {
    beep({ freq: 600, type: 'sine', duration: 0.08, vol: 0.2 });
  }

  function unlock() {
    [784, 880, 988, 1047].forEach((f, i) =>
      beep({ freq: f, type: 'sine', duration: 0.12, delay: i * 0.1 })
    );
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  return { init, correct, wrong, attack, hit, levelUp, gameOver, menuClick, unlock, toggleMute };
})();
