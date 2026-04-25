const params = new URLSearchParams(window.location.search);
const shop = params.get("shop") || "";
const host = params.get("host") || "";
const landingBaseUrl = "https://snaptip.tech";

const state = {
  view: getInitialView(),
};

const authStartUrl = `${landingBaseUrl}/auth/start${shop ? `?shop=${encodeURIComponent(shop)}` : ""}`;

function render() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brandIcon">🐝</div>
          <div>
            <div class="brandName">SnapTip</div>
            <div class="brandMeta">${escapeHtml(shop || "Shopify app")}</div>
          </div>
        </div>
        <nav class="nav">
          <button class="navItem ${state.view === "home" ? "active" : ""}" data-view="home">Home</button>
          <button class="navItem ${state.view === "setting" ? "active" : ""}" data-view="setting">Setting</button>
        </nav>
        <a class="supportLink" href="${landingBaseUrl}/support.html" target="_blank" rel="noreferrer">Support</a>
      </aside>
      <main class="content">
        ${state.view === "home" ? renderHome() : renderSetting()}
      </main>
    </div>
  `;

  app.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      navigate(button.dataset.view);
    });
  });
}

function renderHome() {
  if (!shop) {
    return renderMissingContext();
  }

  return `
    <section class="pageHeader">
      <div>
        <h1>Home</h1>
        <p>SnapTip is connected to this Shopify store.</p>
      </div>
      <span class="statusPill">Connected</span>
    </section>

    <section class="grid two">
      <article class="card">
        <div class="eyebrow">Store</div>
        <h2>${escapeHtml(shop || "Missing shop context")}</h2>
        <p>${shop ? "OAuth completed and installation data should be available in SnapTip Admin." : "Open the app from Shopify Admin so shop context is included."}</p>
      </article>
      <article class="card">
        <div class="eyebrow">Admin backend</div>
        <h2>Installations</h2>
        <p>Use the internal admin to verify install rows, tip totals, webhook events, and bulk email.</p>
        <a class="button secondary" href="${landingBaseUrl}/admin" target="_blank" rel="noreferrer">Open admin</a>
      </article>
    </section>

    <article class="card wide">
      <div class="eyebrow">Next step</div>
      <h2>Configure checkout tipping</h2>
      <p>This embedded shell is now separated from OAuth. We can wire the existing settings UI into this domain next without mixing it with landing/admin routes.</p>
      <button class="button" data-view="setting">Open setting</button>
    </article>
  `;
}

function renderSetting() {
  if (!shop) {
    return renderMissingContext();
  }

  return `
    <section class="pageHeader">
      <div>
        <h1>Setting</h1>
        <p>Checkout tip settings will live in this embedded app domain.</p>
      </div>
    </section>

    <article class="card wide">
      <div class="eyebrow">Embedded app UI</div>
      <h2>Ready for settings migration</h2>
      <p>The production OAuth flow now redirects merchants here after installation. The next implementation step is moving or proxying the existing Shopify app Home and Setting screens into this domain.</p>
      <dl class="metaList">
        <div><dt>Shop</dt><dd>${escapeHtml(shop || "Not provided")}</dd></div>
        <div><dt>Host</dt><dd>${escapeHtml(host || "Not provided")}</dd></div>
      </dl>
    </article>
  `;
}

function renderMissingContext() {
  return `
    <section class="pageHeader">
      <div>
        <h1>Open SnapTip from Shopify</h1>
        <p>This embedded app needs Shopify shop context to load correctly.</p>
      </div>
      <span class="statusPill warning">Missing shop</span>
    </section>

    <article class="card wide">
      <div class="eyebrow">Install flow</div>
      <h2>Start OAuth first</h2>
      <p>Open SnapTip from Shopify Admin or start the install flow from the landing backend so the app receives <code>shop</code> and <code>host</code> query parameters.</p>
      <a class="button" href="${authStartUrl}">Start Shopify install</a>
      <a class="button secondary" href="${landingBaseUrl}" target="_blank" rel="noreferrer">Open landing page</a>
    </article>
  `;
}

function navigate(view) {
  state.view = view;
  const path = view === "setting" ? "/setting" : "/";
  const nextUrl = `${path}${window.location.search}`;
  window.history.replaceState({}, "", nextUrl);
  render();
}

function getInitialView() {
  return window.location.pathname.startsWith("/setting") ? "setting" : "home";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

render();
