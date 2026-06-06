/**
 * result.js — หน้าผลการต่อสู้
 */

const ResultScene = (() => {
  function render({ win, stars, score, accuracy, correct, total, gained }) {
    const title = document.getElementById('result-title');
    const starsEl = document.getElementById('result-stars');
    const stats = document.getElementById('result-stats');

    title.textContent = win ? '🎉 ชนะแล้ว!' : '💀 แพ้แล้ว...';
    title.style.color = win ? '#f1c40f' : '#e74c3c';

    // Stars
    const starArr = [1, 2, 3].map(i =>
      `<span class="star ${i <= stars ? 'lit' : 'dim'}">⭐</span>`
    );
    starsEl.innerHTML = starArr.join('');

    // Stats
    stats.innerHTML = `
      <div class="stat-row"><span>ตอบถูก</span><span>${correct}/${total} ข้อ</span></div>
      <div class="stat-row"><span>ความแม่น</span><span>${accuracy}%</span></div>
      <div class="stat-row"><span>คะแนน</span><span>${score} pts</span></div>
      ${gained > 0 ? `<div class="stat-row highlight"><span>⭐ ดาวที่ได้</span><span>+${gained}</span></div>` : ''}
    `;

    // ซ่อน next stage ถ้าแพ้
    const nextBtn = document.querySelector('[onclick="Game.nextStage()"]');
    if (nextBtn) nextBtn.style.display = win ? 'block' : 'none';
  }

  return { render };
})();
