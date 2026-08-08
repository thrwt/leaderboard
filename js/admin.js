const loginView = document.getElementById("login-view");
const dashView = document.getElementById("dash-view");

function isLoggedIn() {
  return Boolean(sessionStorage.getItem("ctf_admin_token"));
}

function showDashboard() {
  loginView.style.display = "none";
  dashView.style.display = "block";
  loadQueue();
}

function showLogin() {
  loginView.style.display = "block";
  dashView.style.display = "none";
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.textContent = "Logging in…";

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const resultEl = document.getElementById("login-result");

  try {
    const result = await CTF_API.login(username, password);
    sessionStorage.setItem("ctf_admin_token", result.token);
    resultEl.className = "";
    showDashboard();
  } catch (err) {
    resultEl.textContent = err.message;
    resultEl.className = "result-banner show err";
  } finally {
    btn.disabled = false;
    btn.textContent = "Log In";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("ctf_admin_token");
  showLogin();
});

async function loadQueue() {
  const list = document.getElementById("queue-list");
  const count = document.getElementById("queue-count");

  try {
    const { pending } = await CTF_API.getPending();
    count.textContent = `${pending.length} pending`;

    if (!pending.length) {
      list.innerHTML = `<div class="empty-state">Queue is clear. 🎉</div>`;
      return;
    }

    list.innerHTML = pending.map(renderQueueItem).join("");
    list.querySelectorAll("[data-approve]").forEach((btn) =>
      btn.addEventListener("click", () => handleReview(btn.dataset.approve, "approve", btn))
    );
    list.querySelectorAll("[data-reject]").forEach((btn) =>
      btn.addEventListener("click", () => handleReview(btn.dataset.reject, "reject", btn))
    );
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      sessionStorage.removeItem("ctf_admin_token");
      return showLogin();
    }
    list.innerHTML = `<div class="empty-state">Couldn't load queue: ${escapeHtml(err.message)}</div>`;
  }
}

function renderQueueItem(s) {
  return `
    <div class="glass card queue-item" data-id="${s.id}">
      <div class="row">
        <div>
          <strong>${escapeHtml(s.users?.name || "Unknown")}</strong>
          <span class="hint">@${escapeHtml(s.users?.discord_username || "?")}</span>
        </div>
        <span class="hint mono">${fmtDate(s.writeup_submitted_at)}</span>
      </div>
      <div class="row">
        <span class="cat-tag">${escapeHtml(s.challenges?.category || "?")}</span>
        <span>${escapeHtml(s.challenges?.title || "Unknown challenge")}</span>
      </div>
      <a href="${s.writeup_url}" target="_blank" rel="noopener" class="mono" style="color:var(--signal);">
        View writeup →
      </a>
      <div class="actions">
        <select class="score-select" data-score>
          <option value="0">Writeup: Poor (0)</option>
          <option value="1" selected>Writeup: Good (1)</option>
          <option value="2">Writeup: Excellent (2)</option>
        </select>
        <button class="btn btn-signal btn-sm" data-approve="${s.id}">Approve</button>
        <button class="btn btn-danger btn-sm" data-reject="${s.id}">Reject</button>
      </div>
    </div>`;
}

async function handleReview(submissionId, decision, btn) {
  const card = btn.closest(".queue-item");
  const scoreSelect = card.querySelector("[data-score]");
  btn.disabled = true;

  try {
    await CTF_API.review({
      submissionId,
      decision,
      writeupScore: decision === "approve" ? Number(scoreSelect.value) : undefined,
    });
    card.remove();
    const remaining = document.querySelectorAll(".queue-item").length;
    document.getElementById("queue-count").textContent = `${remaining} pending`;
    if (!remaining) {
      document.getElementById("queue-list").innerHTML = `<div class="empty-state">Queue is clear. 🎉</div>`;
    }
  } catch (err) {
    alert(`Action failed: ${err.message}`);
    btn.disabled = false;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn()) showDashboard();
  else showLogin();
});
