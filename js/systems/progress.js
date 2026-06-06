/**
 * progress.js — ระบบบันทึกความคืบหน้าใน localStorage
 * ทำงานได้ทั้ง Online และ Offline
 */

const Progress = (() => {
  const KEY = 'mathquest_save';

  const defaultSave = () => ({
    version: CONFIG.version,
    totalStars: 0,
    unlockedHeroes: ['warrior'],
    lastHero: 'warrior',
    modes: {
      p1: { highScore: 0, stagesCleared: 0, bestStars: {} },
      p4: { highScore: 0, stagesCleared: 0, bestStars: {} },
      p5: { highScore: 0, stagesCleared: 0, bestStars: {} },
      p6: { highScore: 0, stagesCleared: 0, bestStars: {} },
    },
    dailyChallenge: { lastDate: '', streak: 0 },
  });

  let save = null;

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      save = raw ? JSON.parse(raw) : defaultSave();
    } catch {
      save = defaultSave();
    }
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(save));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  }

  function get() {
    if (!save) load();
    return save;
  }

  function recordResult({ mode, stage, stars, score }) {
    if (!save) load();
    const m = save.modes[mode];
    if (!m) return;

    // อัปเดต stars ที่ดีที่สุดต่อด่าน
    const prev = m.bestStars[stage] || 0;
    const gained = Math.max(0, stars - prev);
    m.bestStars[stage] = Math.max(prev, stars);

    // อัปเดต stages cleared
    if (stage + 1 > m.stagesCleared) m.stagesCleared = stage + 1;

    // อัปเดต total stars
    save.totalStars += gained;

    // อัปเดต highscore
    if (score > m.highScore) m.highScore = score;

    // ตรวจ unlock heroes
    checkUnlocks();

    persist();
    return gained;
  }

  function checkUnlocks() {
    const stars = save.totalStars;
    HEROES.forEach(h => {
      if (stars >= h.unlockAt && !save.unlockedHeroes.includes(h.id)) {
        save.unlockedHeroes.push(h.id);
      }
    });
  }

  function isUnlocked(heroId) {
    if (!save) load();
    return save.unlockedHeroes.includes(heroId);
  }

  function setLastHero(heroId) {
    if (!save) load();
    save.lastHero = heroId;
    persist();
  }

  function getHighScores() {
    if (!save) load();
    return Object.entries(save.modes).map(([mode, data]) => ({
      mode,
      label: QUESTION_POOLS[mode]?.label || mode,
      highScore: data.highScore,
      stagesCleared: data.stagesCleared,
      totalStars: Object.values(data.bestStars).reduce((s, v) => s + v, 0),
    }));
  }

  function reset() {
    save = defaultSave();
    persist();
  }

  return { load, get, recordResult, isUnlocked, setLastHero, getHighScores, reset };
})();
