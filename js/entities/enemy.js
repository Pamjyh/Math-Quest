/**
 * enemy.js — Enemy logic: เลือก enemy ตาม mode + stage
 * โครงสร้างใหม่: 3 ระดับ (stage 0-8) + boss (stage 9)
 */

const EnemyEntity = (() => {

  function getForStage(mode, stage) {
    const list = ENEMIES[mode];
    if (!list) return null;

    // ด่านสุดท้าย = boss เสมอ
    if (stage === CONFIG.stagesPerMode - 1) {
      return list.find(e => e.isBoss) || list[list.length - 1];
    }

    // 3 ระดับ: 0-2=ง่าย, 3-5=กลาง, 6-8=ยาก
    const normalEnemies = list.filter(e => !e.isBoss);
    const tier = stage < 3 ? 0 : stage < 6 ? 1 : 2;
    return normalEnemies[Math.min(tier, normalEnemies.length - 1)];
  }

  function calcHP(enemy, stage) {
    // HP เพิ่มขึ้นตาม stage แต่ base อยู่ใน data แล้ว
    const bonus = enemy.isBoss ? 0 : stage * 8;
    return enemy.hp + bonus;
  }

  return { getForStage, calcHP };
})();
