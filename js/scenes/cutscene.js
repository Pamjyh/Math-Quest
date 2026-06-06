/**
 * cutscene.js — Cinematic Story System v2
 * ใช้ STORY จาก cutscene_story.js (โหลดก่อน)
 * รองรับ: side (left/right/center), effect (shake/flash/dark), bgKey ต่อ mode
 */

const Cutscene = (() => {

  // ---- State ----
  let el = null;
  let slides = [];
  let currentIdx = 0;
  let typingTimer = null;
  let targetText = '';
  let onDoneCallback = null;
  let isTyping = false;
  let _currentBgKey = null;
  let _hideTimer = null;   // ← ป้องกัน race condition เมื่อ chain 2 cutscene ติดกัน

  // ---- Init ----
  function init() {
    el = document.getElementById('screen-cutscene');
  }

  // ---- Show by story key ----
  // show(storyKey, onDone, bgKey)
  //   storyKey : key ใน STORY object (cutscene_story.js)
  //   onDone   : callback หลังปิด
  //   bgKey    : sprite key สำหรับ background ของ mode นั้น (optional)
  function show(storyKey, onDone, bgKey) {
    const src = (typeof STORY !== 'undefined') ? STORY[storyKey] : null;
    if (!src || !src.length) { if (onDone) onDone(); return; }
    _currentBgKey = bgKey || null;
    showSlides(src, onDone);
  }

  // ---- Show custom slide array ----
  function showSlides(slideArr, onDone) {
    if (!el) { if (onDone) onDone(); return; }
    // ยกเลิก setTimeout ที่อาจค้างจาก cutscene ก่อนหน้า (ป้องกัน race condition)
    if (_hideTimer) { clearTimeout(_hideTimer); _hideTimer = null; }
    slides = slideArr;
    currentIdx = 0;
    onDoneCallback = onDone || null;
    el.style.display = 'flex';
    requestAnimationFrame(() => el.classList.add('active'));
    _renderSlide(0);
  }

  // ---- Render one slide ----
  function _renderSlide(idx) {
    if (!el || idx >= slides.length) { _close(); return; }
    const s = slides[idx];

    // Background
    _renderBackground(s);

    // Portrait
    _renderPortrait(s);

    // Speaker label
    const speakerEl = el.querySelector('.cs-speaker');
    if (speakerEl) {
      const isNarrator = !s.speaker || s.speaker === 'NARRATOR';
      speakerEl.textContent = isNarrator ? '' : s.speaker;
      // สีชื่อ: ตัวร้าย (right) = แดง, hero = ทอง
      speakerEl.style.color = (s.side === 'right' || s.villain) ? '#e74c3c' : '#f1c40f';
    }

    // Progress dots
    const dotsEl = el.querySelector('.cs-dots');
    if (dotsEl) {
      dotsEl.innerHTML = slides.map((_, i) =>
        `<span class="cs-dot${i === idx ? ' active' : ''}"></span>`
      ).join('');
    }

    // Screen effect
    _applyEffect(s.effect);

    // Typewriter — สีข้อความ
    const isVillain  = s.side === 'right' || s.villain;
    const isHighlight = s.highlight;
    const isNarrator = !s.speaker || s.speaker === 'NARRATOR';
    const textColor = isVillain   ? '#e74c3c'
                    : isHighlight ? '#f1c40f'
                    : isNarrator  ? '#a8b4cc'
                    : '#ecf0f1';
    _typewrite(s.text || '', textColor);
  }

  // ---- Background ----
  function _renderBackground(s) {
    const bgEl = el.querySelector('.cs-bg-layer');
    if (!bgEl) return;

    // ลองโหลด background image ของ mode ก่อน
    const bgImg = _currentBgKey ? Sprites.get(_currentBgKey) : null;
    const hasBgImg = bgImg && (bgImg.width || bgImg.naturalWidth);

    if (hasBgImg) {
      bgEl.style.backgroundImage = `url(${_imgToUrl(bgImg)})`;
      bgEl.style.backgroundSize  = 'cover';
      bgEl.style.backgroundPosition = 'center';
    } else {
      bgEl.style.backgroundImage = '';
      // gradient fallback ตาม effect / side
      if (s.effect === 'dark') {
        bgEl.style.background = 'linear-gradient(160deg,#010108,#02020f)';
      } else if (s.side === 'right' || s.villain) {
        bgEl.style.background = 'linear-gradient(160deg,#2d0000,#1a0000)';
      } else {
        bgEl.style.background = 'linear-gradient(160deg,#0a0a1e,#0d1530)';
      }
    }
  }

  // ---- Portrait ----
  function _renderPortrait(s) {
    const portEl = el.querySelector('.cs-portrait');
    if (!portEl) return;

    const img = s.portrait ? Sprites.get(s.portrait) : null;
    const hasImg = img && (img.width || img.naturalWidth);

    if (hasImg) {
      portEl.style.backgroundImage = `url(${_imgToUrl(img)})`;
      portEl.style.display = 'block';
      // กำหนดซ้าย / ขวา
      portEl.classList.remove('cs-left', 'cs-right');
      portEl.classList.add(s.side === 'left' ? 'cs-left' : 'cs-right');
    } else {
      portEl.style.backgroundImage = '';
      portEl.style.display = 'none';
    }
  }

  // ---- Effects ----
  function _applyEffect(effect) {
    if (!el) return;
    // Remove ก่อนทุกครั้ง แล้ว reflow เพื่อรีเซ็ต animation
    el.classList.remove('cs-shake', 'cs-flash');
    if (effect === 'shake') {
      void el.offsetWidth;
      el.classList.add('cs-shake');
    } else if (effect === 'flash') {
      void el.offsetWidth;
      el.classList.add('cs-flash');
    }
  }

  // ---- Typewriter ----
  function _typewrite(text, color) {
    if (typingTimer) clearInterval(typingTimer);
    const textEl = el.querySelector('.cs-text');
    if (!textEl) return;
    targetText = text;
    isTyping = true;
    textEl.style.color = color;
    let charIdx = 0;
    typingTimer = setInterval(() => {
      if (charIdx >= text.length) {
        clearInterval(typingTimer);
        isTyping = false;
        textEl.innerHTML = _fmt(text) + '<span class="cs-cursor"></span>';
        return;
      }
      charIdx++;
      textEl.innerHTML = _fmt(text.slice(0, charIdx));
    }, 28);
  }

  function _fmt(t) { return t.replace(/\n/g, '<br>'); }

  function _imgToUrl(c) {
    if (c instanceof HTMLCanvasElement) return c.toDataURL();
    if (c instanceof HTMLImageElement)  return c.src;
    return '';
  }

  // ---- Next / Skip ----
  function next() {
    if (isTyping) {
      // กดขณะ type → แสดงข้อความทั้งหมดทันที
      if (typingTimer) clearInterval(typingTimer);
      isTyping = false;
      const textEl = el.querySelector('.cs-text');
      if (textEl) textEl.innerHTML = _fmt(targetText) + '<span class="cs-cursor"></span>';
      return;
    }
    currentIdx++;
    if (currentIdx >= slides.length) { _close(); return; }
    _renderSlide(currentIdx);
  }

  function skip() {
    if (typingTimer) clearInterval(typingTimer);
    _close();
  }

  function _close() {
    if (!el) return;
    el.classList.remove('active', 'cs-shake', 'cs-flash');
    // ใช้ tracked timer เพื่อให้ยกเลิกได้ถ้ามี cutscene ใหม่ตามมาทันที
    if (_hideTimer) clearTimeout(_hideTimer);
    _hideTimer = setTimeout(() => {
      el.style.display = 'none';
      slides = [];
      _hideTimer = null;
    }, 500);
    if (onDoneCallback) { onDoneCallback(); onDoneCallback = null; }
  }

  return { init, show, showSlides, next, skip };
})();
