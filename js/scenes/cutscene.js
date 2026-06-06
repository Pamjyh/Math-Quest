/**
 * cutscene.js — Cinematic Story System
 * Letterbox cinema bars + typewriter + manual Next
 */

const Cutscene = (() => {

  // ======================================
  // STORY DATA — แก้ไขเนื้อหาได้ที่นี่
  // ======================================
  const STORIES = {

    intro: [
      {
        bg: 'bg_night', speaker: null,
        text: 'ณ โรงเรียนแห่งหนึ่ง...\nตัวเลขหายไปจากสมุดทุกเล่มในชั่วข้ามคืน!',
        portrait: null, sound: null,
      },
      {
        bg: 'bg_volcano', speaker: null,
        text: 'มอนสเตอร์จากมิติตัวเลขบุกยึดทุกชั้นเรียน...\nความรู้กำลังจะสูญหายตลอดกาล!',
        portrait: 'boss_demon', sound: null,
      },
      {
        bg: 'bg_night', speaker: '👩‍🏫 ครู',
        text: 'เฉพาะผู้ที่แม่นคณิตศาสตร์เท่านั้น\nที่จะหยุดพวกมันได้!\n\nนักรบวีรบุรุษ... ลุกขึ้นสู้!',
        portrait: 'warrior', highlight: true,
      },
    ],

    bossP1: [
      {
        bg: null, speaker: '👑 สไลม์หัวหน้า',
        text: '"ฮ่าๆ! ข้ายึดชั้น ป.1 แล้ว!\nเด็กๆ จะไม่ได้เรียนบวกลบอีกต่อไป!"',
        portrait: 'boss_slime', villain: true,
      },
      {
        bg: null, speaker: '⚔️ นักรบ',
        text: '"ไม่ได้! ตัวเลขต้องกลับมา!\nข้าจะพิสูจน์ด้วยพลังคณิตศาสตร์!"',
        portrait: 'warrior', highlight: true,
      },
    ],

    bossP4: [
      {
        bg: null, speaker: '👑 นายพลยักษ์มืด',
        text: '"สูตรคูณ? ข้าทำลายมันหมดแล้ว!\nชั้น ป.4 เป็นของข้าตลอดไป!"',
        portrait: 'boss_general', villain: true,
      },
      {
        bg: null, speaker: '⚔️ นักรบ',
        text: '"ข้าจะพิสูจน์ว่าสูตรคูณยังอยู่ในใจเด็กทุกคน!\nสู้เพื่อทุกชั้นเรียน!"',
        portrait: 'warrior', highlight: true,
      },
    ],

    bossP5: [
      {
        bg: null, speaker: '👑 จอมมารแดง',
        text: '"คูณหารสองหลัก? ยากเกินไป!\nเด็กๆ จะยอมแพ้และลืมมันไป!"',
        portrait: 'boss_demon', villain: true,
      },
      {
        bg: null, speaker: '⚔️ นักรบ',
        text: '"ไม่มีทาง! เราสู้ด้วยกัน!\nความรู้ไม่มีวันถูกทำลาย!"',
        portrait: 'warrior', highlight: true,
      },
    ],

    bossP6: [
      {
        bg: null, speaker: '👑 จอมมารมหา',
        text: '"โจทย์ผสม... นี่คือบทสุดท้าย!\nข้าคือความท้าทายสูงสุดที่ไม่มีใครผ่านได้!"',
        portrait: 'boss_grand', villain: true,
      },
      {
        bg: null, speaker: '⚔️ นักรบ',
        text: '"เราพร้อมแล้ว! เพราะเราไม่เคยหยุดฝึก!\nนี่คือการต่อสู้ครั้งสุดท้าย!"',
        portrait: 'warrior', highlight: true,
      },
    ],

    victoryP1:  [{ bg: null, speaker: null, text: '✨ ตัวเลขกลับมาแล้ว!\nชั้น ป.1 ปลอดภัยแล้ว! ขอบคุณนักรบ!', portrait: null }],
    victoryP4:  [{ bg: null, speaker: null, text: '🏆 สูตรคูณกลับมาอยู่ในใจเด็กทุกคนแล้ว!\nชั้น ป.4 ปลอดภัยแล้ว!', portrait: null }],
    victoryP5:  [{ bg: null, speaker: null, text: '🔥 ยอดเยี่ยม! การคูณหารพิชิตได้แล้ว!\nชั้น ป.5 ปลอดภัยแล้ว!', portrait: null }],
    victoryP6:  [{ bg: null, speaker: null, text: '🌟 โรงเรียนได้รับการปลดปล่อยแล้ว!\nคุณคือ... คณิตวีรบุรุษที่แท้จริง!', portrait: null, highlight: true }],

    unlockAngel:   [{ bg: null, speaker: '😇 เทวดา',  text: '"ฉันได้ยินเสียงของผู้มีใจกล้า...\nขอรับใช้คุณในการต่อสู้!"', portrait: 'angel' }],
    unlockGiant:   [{ bg: null, speaker: '👾 ยักษ์',   text: '"RAAAH! ยักษ์ดีพร้อมแล้ว!\nข้าจะปกป้องโรงเรียนนี้!"', portrait: 'giant' }],
    unlockDragon:  [{ bg: null, speaker: '🐉 มังกร',  text: '"ผู้ชนะที่แท้จริง... มาเลย\nเราจะเผาศัตรูด้วยกัน!"', portrait: 'dragon' }],
  };

  // ---- State ----
  let el = null;
  let slides = [];
  let currentIdx = 0;
  let typingTimer = null;
  let currentText = '';
  let targetText = '';
  let onDoneCallback = null;
  let isTyping = false;

  // ---- Init ----
  function init() {
    el = document.getElementById('screen-cutscene');
  }

  // ---- Show story key ----
  function show(storyKey, onDone) {
    const s = STORIES[storyKey];
    if (!s || !s.length) { if (onDone) onDone(); return; }
    showSlides(s, onDone);
  }

  // ---- Show custom slides array ----
  function showSlides(slideArr, onDone) {
    if (!el) { if (onDone) onDone(); return; }
    slides = slideArr;
    currentIdx = 0;
    onDoneCallback = onDone || null;
    el.style.display = 'flex';
    requestAnimationFrame(() => el.classList.add('active'));
    _renderSlide(0);
  }

  function _renderSlide(idx) {
    if (!el || idx >= slides.length) { _close(); return; }
    const s = slides[idx];

    // Background
    const bgEl = el.querySelector('.cs-bg-layer');
    if (bgEl) {
      const bgImg = s.bg ? Sprites.get(s.bg) : null;
      if (bgImg && bgImg.width) {
        bgEl.style.backgroundImage = `url(${_canvasToDataUrl(bgImg)})`;
        bgEl.style.backgroundSize  = 'cover';
      } else {
        bgEl.style.backgroundImage = '';
        bgEl.style.background = s.villain
          ? 'linear-gradient(160deg,#2d0000,#1a0000)'
          : s.highlight
          ? 'linear-gradient(160deg,#0a1030,#162048)'
          : 'linear-gradient(160deg,#0a0a1e,#0d1530)';
      }
    }

    // Portrait
    const portEl = el.querySelector('.cs-portrait');
    if (portEl) {
      const img = s.portrait ? Sprites.get(s.portrait) : null;
      if (img && img.width) {
        portEl.style.backgroundImage = `url(${_canvasToDataUrl(img)})`;
        portEl.style.display = 'block';
      } else {
        portEl.style.display = 'none';
      }
    }

    // Speaker label
    const speakerEl = el.querySelector('.cs-speaker');
    if (speakerEl) speakerEl.textContent = s.speaker || '';

    // Progress dots
    const dotsEl = el.querySelector('.cs-dots');
    if (dotsEl) {
      dotsEl.innerHTML = slides.map((_, i) =>
        `<span class="cs-dot${i === idx ? ' active' : ''}"></span>`
      ).join('');
    }

    // Typewriter text
    _typewrite(s.text || '', s.villain, s.highlight);
  }

  function _typewrite(text, villain, highlight) {
    if (typingTimer) clearInterval(typingTimer);
    const textEl = el.querySelector('.cs-text');
    if (!textEl) return;
    targetText = text;
    currentText = '';
    isTyping = true;
    textEl.style.color = villain ? '#e74c3c' : highlight ? '#f1c40f' : '#ecf0f1';
    let charIdx = 0;
    typingTimer = setInterval(() => {
      if (charIdx >= text.length) {
        clearInterval(typingTimer);
        isTyping = false;
        textEl.innerHTML = _format(text) + '<span class="cs-cursor"></span>';
        return;
      }
      charIdx++;
      currentText = text.slice(0, charIdx);
      textEl.innerHTML = _format(currentText);
    }, 28);
  }

  function _format(t) {
    return t.replace(/\n/g, '<br>');
  }

  function _canvasToDataUrl(c) {
    if (c instanceof HTMLCanvasElement) return c.toDataURL();
    if (c instanceof HTMLImageElement)  return c.src;
    return '';
  }

  // ---- Next button ----
  function next() {
    if (isTyping) {
      // กด Next ขณะ type → แสดงข้อความทั้งหมดทันที
      if (typingTimer) clearInterval(typingTimer);
      isTyping = false;
      const textEl = el.querySelector('.cs-text');
      if (textEl) textEl.innerHTML = _format(targetText) + '<span class="cs-cursor"></span>';
      return;
    }
    currentIdx++;
    if (currentIdx >= slides.length) { _close(); return; }
    _renderSlide(currentIdx);
  }

  function _close() {
    if (!el) return;
    el.classList.remove('active');
    setTimeout(() => {
      el.style.display = 'none';
      slides = [];
    }, 500);
    if (onDoneCallback) { onDoneCallback(); onDoneCallback = null; }
  }

  // ---- Skip all ----
  function skip() {
    if (typingTimer) clearInterval(typingTimer);
    _close();
  }

  return { init, show, showSlides, next, skip, STORIES };
})();
