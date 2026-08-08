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

document.getElementById("writeup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submit-btn");
  btn.disabled = true;
  btn.textContent = "Submitting…";

  const payload = {
    discordUsername: document.getElementById("discordUsername").value.trim(),
    challengeId: document.getElementById("challengeId").value,
    writeupUrl: document.getElementById("writeupUrl").value.trim(),
    notes: document.getElementById("notes").value.trim(),
  };

  try {
    const result = await CTF_API.submitWriteup(payload);
    showResult(result.message, true);
    document.getElementById("writeup-form").reset();
    await populateChallenges();
  } catch (err) {
    showResult(err.data?.message || err.message, false);
  } finally {
    btn.disabled = false;
    btn.textContent = "Submit Writeup";
  }
});

document.addEventListener("DOMContentLoaded", populateChallenges);
