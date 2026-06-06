/**
 * session.js — Session Leaderboard + Player Name
 * ใช้ sessionStorage → ล้างอัตโนมัติเมื่อปิด browser / ครูกด "เริ่มใหม่"
 */

const Session = (() => {
  const KEY = 'mathquest_session';
  const MAX_ENTRIES = 10;

  let currentPlayer = '';

  // โครงสร้าง session
  const defaultSession = () => ({
    players: {},          // { playerName: { p1: score, p4: score, ... } }
    leaderboard: {        // top 10 ต่อ mode
      p1: [], p4: [], p5: [], p6: [],
    },
  });

  let session = null;

  function load() {
    try {
      const raw = sessionStorage.getItem(KEY);
      session = raw ? JSON.parse(raw) : defaultSession();
    } catch {
      session = defaultSession();
    }
  }

  function save() {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Session save failed:', e);
    }
  }

  function get() {
    if (!session) load();
    return session;
  }

  // ตั้งชื่อผู้เล่นปัจจุบัน
  function setPlayer(name) {
    currentPlayer = name.trim() || 'ผู้เล่น';
    if (!session) load();
    if (!session.players[currentPlayer]) {
      session.players[currentPlayer] = { p1: 0, p4: 0, p5: 0, p6: 0 };
    }
    save();
  }

  function getPlayer() { return currentPlayer; }

  // บันทึกคะแนนลง leaderboard
  function recordScore({ mode, score, stars, accuracy }) {
    if (!session) load();
    if (!currentPlayer) return;

    // อัปเดต personal best
    const prev = session.players[currentPlayer]?.[mode] || 0;
    if (score > prev) {
      if (!session.players[currentPlayer]) session.players[currentPlayer] = {};
      session.players[currentPlayer][mode] = score;
    }

    // อัปเดต leaderboard
    const board = session.leaderboard[mode];
    if (!board) return;

    // ลบ entry เก่าของผู้เล่นคนนี้ก่อน
    const existing = board.findIndex(e => e.name === currentPlayer);
    if (existing !== -1) {
      if (score > board[existing].score) {
        board.splice(existing, 1);
      } else {
        save(); return; // คะแนนไม่ดีขึ้น ไม่ต้องอัปเดต
      }
    }

    board.push({ name: currentPlayer, score, stars, accuracy });
    board.sort((a, b) => b.score - a.score);
    session.leaderboard[mode] = board.slice(0, MAX_ENTRIES);
    save();
  }

  // ดึง leaderboard ต่อ mode
  function getLeaderboard(mode) {
    if (!session) load();
    return session.leaderboard[mode] || [];
  }

  // ล้าง session ทั้งหมด (ครูกด "เริ่มใหม่")
  function reset() {
    session = defaultSession();
    currentPlayer = '';
    try { sessionStorage.removeItem(KEY); } catch {}
  }

  // Render leaderboard HTML
  function renderLeaderboardHTML(mode) {
    const board = getLeaderboard(mode);
    const modeLabel = { p1: 'ป.1 Starter', p4: 'ป.4 Explorer', p5: 'ป.5 Challenger', p6: 'ป.6 Master' };
    if (!board.length) {
      return `<p style="color:var(--text-dim);text-align:center">ยังไม่มีคะแนน — เริ่มเล่นก่อนนะครับ!</p>`;
    }
    const medals = ['🥇','🥈','🥉'];
    return `
      <h3 style="color:var(--accent);margin-bottom:10px">${modeLabel[mode] || mode}</h3>
      <table class="leaderboard-table">
        <thead><tr><th>#</th><th>ชื่อ</th><th>คะแนน</th><th>⭐</th><th>แม่น</th></tr></thead>
        <tbody>
          ${board.map((e, i) => `
            <tr class="${e.name === currentPlayer ? 'me' : ''}">
              <td>${medals[i] || (i + 1)}</td>
              <td>${e.name}</td>
              <td>${e.score}</td>
              <td>${'⭐'.repeat(e.stars)}</td>
              <td>${e.accuracy}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  return {
    load, get, setPlayer, getPlayer, recordScore,
    getLeaderboard, renderLeaderboardHTML, reset,
  };
})();
