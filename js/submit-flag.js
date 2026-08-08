async function populateChallenges() {
  const select = document.getElementById("challengeId");
  try {
    const { challenges } = await CTF_API.getChallenges();
    if (!challenges.length) {
      select.innerHTML = `<option value="">No challenges available</option>`;
      return;
    }
    select.innerHTML =
      `<option value="">Select a challenge…</option>` +
      challenges
        .map((c) => `<option value="${c.id}">${c.title} — ${c.category} (${c.difficulty})</option>`)
        .join("");

    const params = new URLSearchParams(location.search);
    const pre = params.get("challenge");
    if (pre) select.value = pre;
  } catch (err) {
    select.innerHTML = `<option value="">Couldn't load challenges</option>`;
  }
}

function showResult(message, ok) {
  const el = document.getElementById("result");
  el.textContent = message;
  el.className = `result-banner show ${ok ? "ok" : "err"}`;
}

document.getElementById("flag-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submit-btn");
  btn.disabled = true;
  btn.textContent = "Submitting…";

  const payload = {
    name: document.getElementById("name").value.trim(),
    discordUsername: document.getElementById("discordUsername").value.trim(),
    challengeId: document.getElementById("challengeId").value,
    flag: document.getElementById("flag").value.trim(),
  };

  try {
    const result = await CTF_API.submitFlag(payload);
    showResult(result.message, true);
    document.getElementById("flag-form").reset();
    await populateChallenges();
  } catch (err) {
    showResult(err.data?.message || err.message, false);
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit Flag";
  }
});

document.addEventListener("DOMContentLoaded", populateChallenges);
