/**
 * config.js — ค่าตั้งต้นทั้งหมดของเกม
 * แก้ไขที่นี่เพื่อปรับ balance, ความยาก, เวลา
 */

const CONFIG = {
  // ---- เวอร์ชัน ----
  version: '1.0.0',
  title: 'Math Quest: คณิตวีรบุรุษ',

  // ---- โหมดห้องเรียน ----
  // ตั้งเป็น true เมื่อครูใช้งานบน projector
  classroomMode: false,

  // ---- เวลาต่อโจทย์ (วินาที) ----
  timer: {
    p1: 15,   // ป.1 ง่าย ให้เวลามากขึ้น
    p4: 12,
    p5: 10,
    p6: 8,
  },

  // ---- Speed bonus (ตอบภายในกี่วินาทีถึงได้ bonus damage) ----
  speedBonusThreshold: 5, // วินาที

  // ---- HP ----
  heroHP: {
    p1: 120,
    p4: 100,
    p5: 100,
    p6: 80,  // p6 ยากขึ้น HP น้อยลง
  },
  enemyHPBase: {
    p1: 60,
    p4: 80,
    p5: 100,
    p6: 120,
  },

  // ---- ดาเมจ ----
  damage: {
    correct: 25,        // โจมตีปกติ
    correctFast: 40,    // ตอบเร็ว (speed bonus)
    wrong: 15,          // ศัตรูโจมตีกลับ
    miss: 10,           // หมดเวลา
  },

  // ---- จำนวนด่านต่อโหมด ----
  stagesPerMode: 10,

  // ---- จำนวน choices ที่แสดง ----
  choiceCount: 4,

  // ---- Stars threshold ----
  stars: {
    three: 90,   // % ความแม่น
    two: 70,
    one: 50,
  },

  // ---- Collection unlock (ใช้ stars สะสม) ----
  unlockAt: {
    angel: 30,
    giant: 80,
    dragon: 150,
  },

  // ---- Animation duration (ms) ----
  anim: {
    attack: 400,
    damage: 300,
    feedback: 800,
  },
};
