// Thin wrapper around fetch — every call targets the backend defined in
// config.js. Admin calls attach the JWT stored in sessionStorage after login.
const CTF_API = {
  base: window.CTF_CONFIG.API_BASE_URL,

  async request(path, { method = "GET", body, admin = false } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (admin) {
      const token = sessionStorage.getItem("ctf_admin_token");
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${this.base}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = {};
    try { data = await res.json(); } catch (_) { /* no body */ }

    if (!res.ok) {
      const err = new Error(data.error || data.message || `Request failed (${res.status})`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  },

  getChallenges: () => CTF_API.request("/challenges"),
  getLeaderboard: () => CTF_API.request("/leaderboard"),
  getProfile: (id) => CTF_API.request(`/profile/${id}`),
  submitFlag: (payload) => CTF_API.request("/submit", { method: "POST", body: payload }),
  submitWriteup: (payload) => CTF_API.request("/submit-writeup", { method: "POST", body: payload }),
  login: (username, password) => CTF_API.request("/login", { method: "POST", body: { username, password } }),
  getPending: () => CTF_API.request("/review/pending", { admin: true }),
  review: (payload) => CTF_API.request("/review", { method: "POST", body: payload, admin: true }),
};
