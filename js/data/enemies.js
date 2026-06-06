/**
 * enemies.js — ศัตรูที่มี sprite จริงครบ
 * spriteId ตรงกับ key ใน sprites.js
 * แต่ละ mode มี 3 ระดับ + 1 boss (stage 9)
 */

const ENEMIES = {
  p1: [
    { id: 'slime_1',   name: 'สไลม์จ้อย',     spriteId: 'slime',       hp: 50,  color: '#2ecc71' },
    { id: 'slime_2',   name: 'สไลม์ตัวใหญ่',   spriteId: 'slime',       hp: 75,  color: '#27ae60' },
    { id: 'slime_3',   name: 'สไลม์โกรธ',      spriteId: 'slime',       hp: 100, color: '#1e8449' },
    { id: 'boss_p1',   name: 'สไลม์หัวหน้า 👑', spriteId: 'boss_slime',  hp: 180, isBoss: true, color: '#8e44ad' },
  ],
  p4: [
    { id: 'goblin_1',  name: 'ก็อบลิน',         spriteId: 'goblin',       hp: 80,  color: '#27ae60' },
    { id: 'goblin_2',  name: 'ก็อบลินนักรบ',     spriteId: 'goblin',       hp: 110, color: '#1e8449' },
    { id: 'goblin_3',  name: 'ก็อบลินจ่า',       spriteId: 'goblin',       hp: 140, color: '#145a32' },
    { id: 'boss_p4',   name: 'นายพลยักษ์มืด 👑', spriteId: 'boss_general', hp: 220, isBoss: true, color: '#c0392b' },
  ],
  p5: [
    { id: 'knight_1',  name: 'อัศวินมืด',        spriteId: 'dark_knight',  hp: 110, color: '#2c3e50' },
    { id: 'knight_2',  name: 'อัศวินมืดจ่า',     spriteId: 'dark_knight',  hp: 145, color: '#1a252f' },
    { id: 'knight_3',  name: 'อัศวินมืดนายพล',   spriteId: 'dark_knight',  hp: 180, color: '#0b0b0b' },
    { id: 'boss_p5',   name: 'จอมมารแดง 👑',      spriteId: 'boss_demon',   hp: 260, isBoss: true, color: '#e74c3c' },
  ],
  p6: [
    { id: 'shadow_1',  name: 'เงาอสูร',           spriteId: 'shadow',       hp: 130, color: '#6c3483' },
    { id: 'shadow_2',  name: 'เงาอสูรพลัง',       spriteId: 'shadow',       hp: 170, color: '#4a235a' },
    { id: 'shadow_3',  name: 'เงาอสูรจ่า',        spriteId: 'shadow',       hp: 210, color: '#2e1146' },
    { id: 'boss_p6',   name: 'จอมมารมหา 👑',       spriteId: 'boss_grand',   hp: 320, isBoss: true, color: '#1a0a2e' },
  ],
};
