// Shared nav + footer, injected into every page from one place.
// Edit the HTML strings below once and every page updates automatically —
// no need to copy/paste nav changes across 5 files.

const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "leaderboard.html", label: "Leaderboard" },
  { href: "submit-flag.html", label: "Submit Flag", cta: true },
  { href: "submit-writeup.html", label: "Submit Writeup" },
  { href: "admin.html", label: "Admin" },
];

function renderNav() {
  const current = location.pathname.split("/").pop() || "index.html";
  const links = NAV_LINKS.map(
    (l) =>
      `<a href="${l.href}" data-page="${l.href}" class="${l.cta ? "cta" : ""} ${l.href === current ? "active" : ""}">${l.label}</a>`
  ).join("");

  document.querySelectorAll("[data-partial='nav']").forEach((el) => {
    el.outerHTML = `
      <nav class="navbar">
        <div class="shell">
          <a href="index.html" class="nav-brand">
            <span class="brand-mark">DFIR<span class="dot">.</span></span>
            <span class="tag">CTF</span>
          </a>
          <div class="nav-links">${links}</div>
        </div>
      </nav>`;
  });
}

function renderFooter() {
  document.querySelectorAll("[data-partial='footer']").forEach((el) => {
    el.outerHTML = `
      <footer>
        <div class="shell">
          <p>DFIR // CTF Platform</p>
          <p class="credit">&copy; ${new Date().getFullYear()} All rights reserved to <a href="https://thrwt.ninja" target="_blank" rel="noopener">Thrwt</a></p>
        </div>
      </footer>`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNav();
  renderFooter();
});
