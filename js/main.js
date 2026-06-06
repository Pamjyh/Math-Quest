/**
 * main.js — จุดเริ่มต้นเกม, ตัว controller หลัก
 * Game object เป็น global สำหรับใช้ใน onclick ของ HTML
 */

const Game = (() => {
  let currentMode = null;
  let currentHero = null;
  let currentStage = 0;
  const _introShown = {};   // reset ทุก page load → intro แสดงครั้งแรกของแต่ละ mode

  // ---- Init ----
  function init() {
    Audio.init();
    Cutscene.init();
    Progress.load();
    Session.load();
    simulateLoading();
  }

  function simulateLoading() {
    const fill = document.getElementById('loading-fill');
    const text = document.getElementById('loading-text');

    text.textContent = 'โหลดรูปภาพตัวละคร...';

    Sprites.preload((progress) => {
      const pct = Math.round(progress * 90);
      fill.style.width = pct + '%';
      text.textContent = `โหลดรูปภาพ... ${Math.round(progress * 100)}%`;
    }).then(() => {
      fill.style.width = '95%';
      text.textContent = 'เตรียมระบบโจทย์...';
      setTimeout(() => {
        fill.style.width = '100%';
        text.textContent = '⚔️ พร้อมแล้ว!';
        setTimeout(showMenu, 500);
      }, 300);
    });
  }

  // ---- Screen Navigation ----
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function showMenu() {
    MenuScene.render();
    showScreen('screen-menu');
  }

  // Name Entry — เรียกก่อน mode select
  function showNameEntry() {
    Audio.menuClick();
    const inp = document.getElementById('player-name-input');
    if (inp) inp.value = Session.getPlayer();
    showScreen('screen-name');
  }

  function confirmName() {
    const inp = document.getElementById('player-name-input');
    const name = inp ? inp.value.trim() : '';
    if (!name) { if (inp) inp.focus(); return; }
    Session.setPlayer(name);
    Audio.menuClick();
    showScreen('screen-mode');
  }

  function showModeSelect() {
    // ถ้ายังไม่มีชื่อ → ให้ใส่ชื่อก่อน
    if (!Session.getPlayer()) { showNameEntry(); return; }
    Audio.menuClick();
    showScreen('screen-mode');
  }

  function showHeroSelect(mode) {
    currentMode = mode;
    HeroEntity.renderSelectScreen();
    showScreen('screen-hero');
  }

  function selectMode(mode) {
    Audio.menuClick();
    showHeroSelect(mode);
  }

  function selectHero(heroId) {
    if (!Progress.isUnlocked(heroId)) return;
    Audio.menuClick();
    currentHero = HEROES.find(h => h.id === heroId);
    Progress.setLastHero(heroId);
    currentStage = 0;
    startBattle();
  }

  function startBattle() {
    showScreen('screen-battle');
    requestAnimationFrame(() => {
      // แสดง intro cutscene ครั้งแรกของแต่ละ mode (reset ทุก page load)
      if (currentStage === 0 && !_introShown[currentMode]) {
        _introShown[currentMode] = true;
        Cutscene.show('intro', () => {
          BattleScene.start({ mode: currentMode, hero: currentHero, stage: currentStage });
        });
      } else {
        BattleScene.start({ mode: currentMode, hero: currentHero, stage: currentStage });
      }
    });
  }

  function pauseBattle() {
    BattleScene.pause();
  }

  function quitBattle() {
    BattleScene.stop();
    showMenu();
  }

  function retryStage() {
    Audio.menuClick();
    startBattle();
  }

  function nextStage() {
    Audio.menuClick();
    currentStage = Math.min(currentStage + 1, CONFIG.stagesPerMode - 1);
    startBattle();
  }

  function showResult(data) {
    ResultScene.render(data);
    showScreen('screen-result');
  }

  function showCollection() {
    Audio.menuClick();
    HeroEntity.renderCollectionScreen();
    showScreen('screen-collection');
  }

  let currentLBTab = 'p1';

  function showLeaderboard() {
    Audio.menuClick();
    currentLBTab = 'p1';
    renderLBTab('p1');
    showScreen('screen-leaderboard');
  }

  function showLBTab(mode) {
    currentLBTab = mode;
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.lb-tab')[['p1','p4','p5','p6'].indexOf(mode)]?.classList.add('active');
    renderLBTab(mode);
  }

  function renderLBTab(mode) {
    const el = document.getElementById('lb-content');
    if (el) el.innerHTML = Session.renderLeaderboardHTML(mode);
  }

  function resetSession() {
    if (!confirm('ล้าง Leaderboard ทั้งหมด?')) return;
    Session.reset();
    MathSystem.resetSession();
    renderLBTab(currentLBTab);
  }

  function showAbout() {
    Audio.menuClick();
    showScreen('screen-about');
  }

  // ---- Classroom Mode Toggle ----
  function enableClassroomMode() {
    CONFIG.classroomMode = true;
    document.getElementById('classroom-badge').style.display = 'block';
  }

  // ---- Expose ----
  return {
    init, showMenu, showModeSelect, showNameEntry, confirmName,
    selectMode, selectHero, pauseBattle, quitBattle, retryStage, nextStage, showResult,
    showCollection, showLeaderboard, showLBTab, resetSession, showAbout, enableClassroomMode,
  };
})();

// เริ่มเกม
window.addEventListener('DOMContentLoaded', Game.init);
