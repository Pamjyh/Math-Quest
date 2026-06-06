/**
 * math.js — Pool Cycling + Weakness Weighting
 * รับประกันทุก table โผล่ก่อนซ้ำ + ตอบผิดโผล่บ่อยขึ้น
 */

const MathSystem = (() => {

  // --- Weakness tracker (reset ทุก session) ---
  // { mode: { tableKey: { correct: N, wrong: N } } }
  let weakness = { p1: {}, p4: {}, p5: {}, p6: {} };

  // --- Pool per mode (queue ที่ยังไม่ได้โผล่) ---
  let pool = { p1: [], p4: [], p5: [], p6: [] };

  // --- build pool ตาม mode + difficulty ---
  function buildPool(mode, difficulty) {
    const items = [];
    if (mode === 'p1') {
      const max = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20;
      for (let a = 1; a <= max; a++) {
        for (let b = 1; b <= Math.min(a, max - a + 1); b++) {
          items.push({ op: '+', a, b });
          if (a - b >= 0) items.push({ op: '-', a, b });
        }
      }
    } else if (mode === 'p4') {
      const minT = difficulty === 1 ? 2 : 2;
      const maxT = difficulty === 1 ? 5 : difficulty === 2 ? 9 : 12;
      for (let t = minT; t <= maxT; t++) {
        for (let b = 1; b <= 12; b++) {
          items.push({ op: '×', a: t, b });
        }
      }
    } else if (mode === 'p5') {
      if (difficulty <= 2) {
        for (let a = 11; a <= (difficulty === 1 ? 15 : 19); a++) {
          for (let b = 2; b <= 9; b++) items.push({ op: '×', a, b });
        }
      }
      // หาร
      for (let d = 2; d <= (difficulty === 3 ? 12 : 9); d++) {
        for (let q = 2; q <= 12; q++) items.push({ op: '÷', a: d * q, b: d });
      }
    } else if (mode === 'p6') {
      if (difficulty <= 2) {
        for (let a = 11; a <= 99; a += 11) {
          for (let b = 2; b <= 9; b++) items.push({ op: '×', a, b });
        }
        for (let d = 2; d <= 12; d++) {
          for (let q = 2; q <= 20; q++) items.push({ op: '÷', a: d * q, b: d });
        }
      } else {
        // 2-step
        for (let a = 2; a <= 9; a++) {
          for (let b = 2; b <= 9; b++) {
            for (let c = 1; c <= 10; c++) items.push({ op: 'mixed', a, b, c });
          }
        }
      }
    }
    return shuffle(items);
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // แปลง item → question object { q, a, tableKey }
  function itemToQuestion(item) {
    if (item.op === '+') return { q: `${item.a} + ${item.b} = ?`, a: item.a + item.b, tableKey: `+${item.b}` };
    if (item.op === '-') return { q: `${item.a} - ${item.b} = ?`, a: item.a - item.b, tableKey: `-${item.b}` };
    if (item.op === '×') return { q: `${item.a} × ${item.b} = ?`, a: item.a * item.b, tableKey: `×${item.a}` };
    if (item.op === '÷') return { q: `${item.a} ÷ ${item.b} = ?`, a: item.a / item.b, tableKey: `÷${item.b}` };
    if (item.op === 'mixed') return {
      q: `(${item.a} × ${item.b}) + ${item.c} = ?`,
      a: item.a * item.b + item.c,
      tableKey: `×mixed`,
    };
  }

  // ดึงโจทย์ถัดไปจาก pool (มี weakness weighting)
  let lastTableKey = '';

  function generateQuestion(mode, difficulty = 1) {
    // refill pool ถ้าหมด
    if (!pool[mode] || pool[mode].length === 0) {
      pool[mode] = buildPool(mode, difficulty);
      // เพิ่ม weakness items เป็น 2x
      const w = weakness[mode] || {};
      const extraItems = [];
      Object.entries(w).forEach(([key, stat]) => {
        if (stat.wrong > stat.correct) {
          // หาและซ้ำ items ที่ตรงกับ tableKey ที่อ่อน
          const found = pool[mode].filter(item => {
            const q = itemToQuestion(item);
            return q.tableKey === key;
          });
          extraItems.push(...found); // เพิ่มอีก 1 ชุด
        }
      });
      pool[mode] = shuffle([...pool[mode], ...extraItems]);
    }

    // ดึงจาก pool หลีกเลี่ยงโจทย์เดิมซ้ำ
    let idx = 0;
    for (let i = 0; i < Math.min(5, pool[mode].length); i++) {
      const q = itemToQuestion(pool[mode][i]);
      if (q.tableKey !== lastTableKey) { idx = i; break; }
    }

    const item = pool[mode].splice(idx, 1)[0];
    const q = itemToQuestion(item);
    lastTableKey = q.tableKey;
    return q;
  }

  // บันทึก weakness
  function recordAnswer(mode, question, isCorrect) {
    if (!weakness[mode]) weakness[mode] = {};
    const key = question.tableKey || 'unknown';
    if (!weakness[mode][key]) weakness[mode][key] = { correct: 0, wrong: 0 };
    if (isCorrect) weakness[mode][key].correct++;
    else weakness[mode][key].wrong++;
  }

  // reset ทุก session ใหม่
  function resetSession() {
    weakness = { p1: {}, p4: {}, p5: {}, p6: {} };
    pool = { p1: [], p4: [], p5: [], p6: [] };
    lastTableKey = '';
  }

  // สร้างตัวเลือกผิด
  function buildChoices(question, mode) {
    const correct = question.a;
    const count = mode === 'p1' ? 2 : 3; // p1 = 3 choices (correct + 2 wrong), อื่น = 4
    const wrongs = new Set();
    let attempts = 0;

    const spread = mode === 'p1' ? 4 : mode === 'p4' ? 12 : 20;
    while (wrongs.size < count && attempts < 200) {
      attempts++;
      const offset = Math.floor(Math.random() * spread) + 1;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const wrong = correct + sign * offset;
      if (wrong > 0 && wrong !== correct) wrongs.add(wrong);
    }

    return shuffle([correct, ...Array.from(wrongs).slice(0, count)]);
  }

  function check(answer, question) {
    return Number(answer) === question.a;
  }

  function getDifficulty(stage) {
    if (stage < 3) return 1;
    if (stage < 7) return 2;
    return 3;
  }

  return { generateQuestion, buildChoices, check, getDifficulty, recordAnswer, resetSession };
})();
