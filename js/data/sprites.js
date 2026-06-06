/**
 * sprites.js — โหลด + ลบ background (ดำ/ขาว/checkered) อัตโนมัติ
 * ทำงานครั้งเดียวตอนโหลด → cache เป็น OffscreenCanvas
 */

const Sprites = (() => {
  const BASE = 'Pic/';
  const cache = {};  // { key: OffscreenCanvas หรือ HTMLCanvasElement }

  const FILES = {
    // ── Battle sprites (Pic/) ─────────────────────────────
    warrior:      'warrior.png',
    angel:        'angel.png',
    dragon:       'dragon.png',
    fairy:        'fairy.png',
    giant:        'giant.png',
    indra:        'indra.png',
    kubera:       'kubera.png',
    legend:       'legend.png',
    slime:        'slime.png',
    boss_slime:   'boss_slime.png',
    goblin:       'goblin.png',
    boss_general: 'boss_general.png',
    dark_knight:  'dark_knight.png',
    boss_demon:   'boss_demon.png',
    shadow:       'shadow.png',
    boss_grand:   'boss_grand.png',
    bg_volcano:   'bg_volcano.png',
    bg_snow:      'bg_snow.png',
    bg_castle:    'bg_castle.png',

    // ── Cutscene portraits (หน้าตัดฉาก/) ─────────────────
    hero_warrior:    'หน้าตัดฉาก/hero_warrior.png',
    hero_angel:      'หน้าตัดฉาก/hero_angel.png',
    hero_giant:      'หน้าตัดฉาก/hero_giant.png',
    hero_dragon:     'หน้าตัดฉาก/hero_dragon.png',
    hero_fairy:      'หน้าตัดฉาก/hero_fairy.png',
    hero_indra:      'หน้าตัดฉาก/hero_indra.png',
    hero_vaisravana: 'หน้าตัดฉาก/hero_vaisravana.png',
    hero_ultimate:   'หน้าตัดฉาก/hero_ultimate.png',
    boss_m1:         'หน้าตัดฉาก/boss_m1.png',
    boss_m4:         'หน้าตัดฉาก/boss_m4.png',
    boss_m5:         'หน้าตัดฉาก/boss_m5.png',
    villain_chaoz:   'หน้าตัดฉาก/villain_chaoz.png',

    // ── Mode backgrounds (พื้นหลัง/) ─────────────────────
    bg_p1: 'พื้นหลัง/BG1.png',
    bg_p4: 'พื้นหลัง/BG2.png',
    bg_p5: 'พื้นหลัง/BG3.png',
    bg_p6: 'พื้นหลัง/BG4.png',
  };

  // ไฟล์ที่ไม่ต้อง remove bg (landscapes + backgrounds)
  const NO_REMOVE_BG = new Set([
    'bg_volcano', 'bg_snow', 'bg_castle',
    'bg_p1', 'bg_p4', 'bg_p5', 'bg_p6',
  ]);

  const total = Object.keys(FILES).length;
  let loaded = 0;

  // ---- ลบ background สีดำ + สีขาว + checkered ----
  function removeBg(img) {
    const w = img.naturalWidth  || img.width;
    const h = img.naturalHeight || img.height;

    const canvas = document.createElement('canvas');
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);

    // file:// protocol อาจ block getImageData → fallback วาดตรง
    let imgData;
    try { imgData = ctx.getImageData(0, 0, w, h); }
    catch (e) {
      console.warn('[Sprites] getImageData blocked (file://), using raw image:', e.message);
      return img; // fallback: ใช้ Image object เดิม
    }

    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i+1], b = d[i+2];

      // กรอบดำ (dark background เช่น warrior)
      const isDark = r < 30 && g < 30 && b < 30;

      // พื้นขาว / checkered (slime, เส้นตาราง ~192 หรือ 255)
      const isWhite = r > 210 && g > 210 && b > 210;

      // checkered gray ของ Photoshop/Leonardo transparent pattern
      const isCheckered = Math.abs(r - 192) < 25 && Math.abs(g - 192) < 25 && Math.abs(b - 192) < 25;

      if (isDark || isWhite || isCheckered) {
        d[i + 3] = 0;  // alpha = 0 → transparent
      }
    }

    // soft edge: ทำ pixel รอบ transparent ให้ alpha ลดลงนิด (anti-fringe)
    _softenEdges(d, w, h);

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  // ลด fringing ที่ขอบ: pixel ที่อยู่ถัดจาก transparent → alpha 50%
  function _softenEdges(d, w, h) {
    const alpha = new Uint8Array(d.length / 4);
    for (let i = 0; i < alpha.length; i++) alpha[i] = d[i * 4 + 3];

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (alpha[idx] === 0) continue; // ตัวเองโปร่ง — ข้าม
        // ถ้าเพื่อนบ้านโปร่ง → ลด alpha ลงครึ่ง (soften)
        const hasTransparentNeighbor =
          alpha[(y-1)*w + x] === 0 || alpha[(y+1)*w + x] === 0 ||
          alpha[y*w + (x-1)] === 0 || alpha[y*w + (x+1)] === 0;
        if (hasTransparentNeighbor) {
          d[idx * 4 + 3] = Math.floor(alpha[idx] * 0.6);
        }
      }
    }
  }

  // ---- Preload ----
  function preload(onProgress) {
    return new Promise((resolve) => {
      Object.entries(FILES).forEach(([key, file]) => {
        const img = new Image();
        // crossOrigin ต้องการเฉพาะ http/https เท่านั้น — file:// ไม่ต้อง
        if (location.protocol !== 'file:') img.crossOrigin = 'anonymous';
        img.onload = () => {
          // process ลบ bg เฉพาะตัวละคร ไม่ใช่ background
          cache[key] = NO_REMOVE_BG.has(key) ? img : removeBg(img);
          loaded++;
          if (onProgress) onProgress(loaded / total);
          if (loaded >= total) resolve();
        };
        img.onerror = () => {
          loaded++;
          console.warn(`[Sprites] ไม่พบ: ${file}`);
          if (loaded >= total) resolve();
        };
        // ถ้า file มี '/' แล้วให้ใช้ path ตรงๆ ไม่ต้อง prepend BASE
        img.src = file.includes('/') ? file : BASE + file;
      });
    });
  }

  function get(key)   { return cache[key] || null; }
  function ready(key) {
    const c = cache[key];
    return c && (c.width > 0);
  }

  return { preload, get, ready, total };
})();
