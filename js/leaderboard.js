async function loadLeaderboard() {
  const body = document.getElementById("lb-body");
  const count = document.getElementById("lb-count");

  try {
    const { leaderboard } = await CTF_API.getLeaderboard();
    count.textContent = `${leaderboard.length} participants`;

    if (!leaderboard.length) {
      body.innerHTML = `<tr><td colspan="8" class="empty-state">No approved submissions yet — be the first!</td></tr>`;
      return;
    }

    body.innerHTML = leaderboard
      .map((row) => {
        const rankClass = row.rank === 1 ? "rank-1" : row.rank === 2 ? "rank-2" : row.rank === 3 ? "rank-3" : "";
        const fire = row.firstBloodCount > 0 ? `<span class="fire">🔥 ${row.firstBloodCount}</span>` : "—";
        return `
        <tr>
          <td class="mono ${rankClass}">#${row.rank}</td>
          <td>${escapeHtml(row.participant)}</td>
          <td>${row.solvedChallenges}</td>
          <td>${row.flagPoints}</td>
          <td>${row.writeupPoints}</td>
          <td class="mono" style="font-weight:600;">${row.totalPoints}</td>
          <td>${fire}</td>
          <td class="hint">${fmtDate(row.lastSolve)}</td>
        </tr>`;
      })
      .join("");
  } catch (err) {
    body.innerHTML = `<tr><td colspan="8" class="empty-state">Couldn't load leaderboard: ${escapeHtml(err.message)}</td></tr>`;
    count.textContent = "error";
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", loadLeaderboard);
