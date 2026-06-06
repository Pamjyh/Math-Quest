/**
 * heroes.js — ตัวละคร 8 ตัว + Badges 8 ใบ + Worlds 4 ฉาก
 */

const HEROES = [
  {
    id: 'warrior', name: 'นักรบไทย', emoji: '⚔️',
    desc: 'นักรบผู้กล้าหาญ เริ่มต้นสมดุล',
    color: '#e74c3c', unlockAt: 0, unlockCond: null,
    stats: { atk: 25, def: 15, spd: 1.0 },
    pixelColors: { body: '#c0392b', armor: '#e8d5a3', detail: '#f39c12', skin: '#f5cba7' },
  },
  {
    id: 'angel', name: 'เทวดา', emoji: '😇',
    desc: 'ตอบเร็วโจมตีแรง',
    color: '#f1c40f', unlockAt: 30, unlockCond: null,
    stats: { atk: 30, def: 10, spd: 1.3 },
    pixelColors: { body: '#f8f9fa', armor: '#f1c40f', detail: '#e67e22', skin: '#f5cba7' },
  },
  {
    id: 'giant', name: 'ยักษ์วีรบุรุษ', emoji: '👾',
    desc: 'HP สูงมาก แข็งแกร่ง',
    color: '#27ae60', unlockAt: 80, unlockCond: null,
    stats: { atk: 20, def: 30, spd: 0.8 },
    pixelColors: { body: '#1e8449', armor: '#922b21', detail: '#f39c12', skin: '#82e0aa' },
  },
  {
    id: 'dragon', name: 'นักรบมังกร', emoji: '🐉',
    desc: 'ทรงพลังที่สุด',
    color: '#8e44ad', unlockAt: 150, unlockCond: null,
    stats: { atk: 40, def: 20, spd: 1.2 },
    pixelColors: { body: '#6c3483', armor: '#1a5276', detail: '#f1c40f', skin: '#f5cba7' },
  },
  {
    id: 'fairy', name: 'นางฟ้า', emoji: '🧚',
    desc: 'เร็วมาก ไม่แพ้ใคร',
    color: '#fd79a8', unlockAt: 999, unlockCond: { type: 'clearMode', mode: 'p1' },
    stats: { atk: 28, def: 12, spd: 1.5 },
    pixelColors: { body: '#fd79a8', armor: '#fdcb6e', detail: '#6c5ce7', skin: '#f5cba7' },
  },
  {
    id: 'indra', name: 'พระอินทร์', emoji: '⚡',
    desc: 'เทพสายฟ้า โจมตีคู่',
    color: '#0984e3', unlockAt: 999, unlockCond: { type: 'clearMode', mode: 'p4' },
    stats: { atk: 35, def: 25, spd: 1.1 },
    pixelColors: { body: '#0984e3', armor: '#fdcb6e', detail: '#d63031', skin: '#f5cba7' },
  },
  {
    id: 'kubera', name: 'ท้าวเวสสุวรรณ', emoji: '👹',
    desc: 'เทพผู้พิทักษ์ ป้องกันสูง',
    color: '#00b894', unlockAt: 999, unlockCond: { type: 'clearMode', mode: 'p5' },
    stats: { atk: 22, def: 40, spd: 0.9 },
    pixelColors: { body: '#00b894', armor: '#d63031', detail: '#fdcb6e', skin: '#55efc4' },
  },
  {
    id: 'legend', name: 'สุดยอดวีรบุรุษ', emoji: '🌟',
    desc: 'ผู้ชนะทุก Mode',
    color: '#fdcb6e', unlockAt: 999, unlockCond: { type: 'clearAll' },
    stats: { atk: 45, def: 35, spd: 1.3 },
    pixelColors: { body: '#fdcb6e', armor: '#e17055', detail: '#6c5ce7', skin: '#f5cba7' },
  },
];

// ---- Badges ----
const BADGES = [
  { id: 'speedster',  name: 'นักตอบเร็ว',    emoji: '⚡', desc: 'ตอบใน 3 วิ × 5 ข้อติดกัน' },
  { id: 'perfect',    name: 'แม่นยำสูงสุด',  emoji: '🎯', desc: 'ตอบถูก 100% ใน 1 ด่าน' },
  { id: 'combo10',    name: 'Combo ×10',      emoji: '🔥', desc: 'ตอบถูกติดกัน 10 ข้อ' },
  { id: 'bosskiller', name: 'ฆ่า Boss',       emoji: '💀', desc: 'ชนะด่านบอส' },
  { id: 'allmode',    name: 'นักเรียนดี',     emoji: '📚', desc: 'เล่นครบทุก Mode' },
  { id: 'star200',    name: 'เซียนคณิต',     emoji: '⭐', desc: 'สะสม 200 ดาว' },
  { id: 'comeback',   name: 'ผู้ไม่ยอมแพ้',  emoji: '🌙', desc: 'แพ้แล้วกลับมาชนะด่านเดิม' },
  { id: 'collector',  name: 'ราชาคณิต',      emoji: '👑', desc: 'Unlock ครบทุก Hero' },
];

// ---- Worlds (background) ----
const WORLDS = [
  {
    id: 'night',     name: 'ท้องฟ้ายามค่ำ',   emoji: '🌌',
    unlockCond: null,
    skyTop: '#0a0a1a', skyBot: '#16213e', groundCol: '#0f3460', lineCol: '#1a4a7a',
  },
  {
    id: 'volcano',   name: 'ดินแดนภูเขาไฟ',   emoji: '🌋',
    unlockCond: { type: 'clearMode', mode: 'p4' },
    skyTop: '#2d0000', skyBot: '#7b1a00', groundCol: '#3d0000', lineCol: '#c0392b',
  },
  {
    id: 'snow',      name: 'ยอดเขาหิมะ',       emoji: '🏔️',
    unlockCond: { type: 'clearMode', mode: 'p5' },
    skyTop: '#1a2a4a', skyBot: '#5d9cec', groundCol: '#d6eaf8', lineCol: '#aed6f1',
  },
  {
    id: 'castle',    name: 'ปราสาทสีทอง',      emoji: '🏯',
    unlockCond: { type: 'clearAll' },
    skyTop: '#1a0a00', skyBot: '#5d4037', groundCol: '#4a2800', lineCol: '#f1c40f',
  },
];
