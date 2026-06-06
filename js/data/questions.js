/**
 * questions.js — คลังโจทย์แยกตามชั้น
 * แต่ละโจทย์: { q: 'โจทย์', a: คำตอบ, type: ประเภท }
 * MathSystem จะดึงโจทย์จาก pool นี้ + generate เพิ่มแบบ random
 */

const QUESTION_POOLS = {

  // ===========================
  // ป.1 — บวกลบ 1–20
  // ===========================
  p1: {
    label: 'ป.1 · บวก-ลบ',
    generate(difficulty = 1) {
      const max = difficulty === 1 ? 10 : 20;
      const ops = ['+', '-'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a = Math.floor(Math.random() * max) + 1;
      let b = Math.floor(Math.random() * max) + 1;
      if (op === '-') {
        if (a < b) [a, b] = [b, a]; // ไม่ให้ผลลบ
      }
      const ans = op === '+' ? a + b : a - b;
      if (ans < 0 || ans > 20) return this.generate(difficulty); // re-roll
      return { q: `${a} ${op} ${b} = ?`, a: ans, type: op === '+' ? 'add' : 'sub' };
    },
  },

  // ===========================
  // ป.4 — สูตรคูณ 1–12
  // ===========================
  p4: {
    label: 'ป.4 · สูตรคูณ',
    generate(difficulty = 1) {
      const maxTable = difficulty === 1 ? 6 : 12;
      const a = Math.floor(Math.random() * maxTable) + 1;
      const b = Math.floor(Math.random() * 12) + 1;
      // สลับรูปแบบบ้าง เพื่อไม่ให้จำแค่ pattern
      const flip = Math.random() > 0.5;
      return {
        q: flip ? `${b} × ${a} = ?` : `${a} × ${b} = ?`,
        a: a * b,
        type: 'mul',
      };
    },
  },

  // ===========================
  // ป.5 — สูตรคูณ + หาร
  // ===========================
  p5: {
    label: 'ป.5 · คูณ-หาร',
    generate(difficulty = 1) {
      const useDiv = Math.random() > 0.5;
      if (!useDiv) {
        // คูณ 2 หลัก × 1 หลัก
        const a = Math.floor(Math.random() * 9) + 11; // 11–19
        const b = Math.floor(Math.random() * 9) + 1;
        return { q: `${a} × ${b} = ?`, a: a * b, type: 'mul' };
      } else {
        // หาร: สร้างจากคูณก่อน ให้ตอบลงตัว
        const b = Math.floor(Math.random() * 11) + 2;
        const ans = Math.floor(Math.random() * 10) + 1;
        const a = b * ans;
        return { q: `${a} ÷ ${b} = ?`, a: ans, type: 'div' };
      }
    },
  },

  // ===========================
  // ป.6 — โจทย์ผสม (คูณ หาร ใน context)
  // ===========================
  p6: {
    label: 'ป.6 · โจทย์รวม',
    generate(difficulty = 1) {
      const types = ['mul', 'div', 'mixed'];
      const t = types[Math.floor(Math.random() * types.length)];

      if (t === 'mul') {
        const a = Math.floor(Math.random() * 89) + 11; // 11–99
        const b = Math.floor(Math.random() * 9) + 2;
        return { q: `${a} × ${b} = ?`, a: a * b, type: 'mul' };
      } else if (t === 'div') {
        const b = Math.floor(Math.random() * 11) + 2;
        const ans = Math.floor(Math.random() * 20) + 1;
        return { q: `${b * ans} ÷ ${b} = ?`, a: ans, type: 'div' };
      } else {
        // (a × b) + c = ?
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        const c = Math.floor(Math.random() * 10) + 1;
        return { q: `(${a} × ${b}) + ${c} = ?`, a: a * b + c, type: 'mixed' };
      }
    },
  },
};
