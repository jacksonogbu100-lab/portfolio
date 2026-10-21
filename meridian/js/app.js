(() => {
  const TITLES = {
    monitor: "Gateway monitor",
    routes: "Traffic routing",
    services: "Service discovery",
    consumers: "API authentication",
    limits: "Rate limiting",
    billing: "Usage billing",
  };

  const RANGES = {
    "1h": {
      label: "Last 1 hour",
      factor: 184 / 2650,
      latency: 96.4,
      points: 12,
      hint: "Compared with the previous hour",
    },
    "6h": {
      label: "Last 6 hours",
      factor: 812 / 2650,
      latency: 121.18,
      points: 12,
      hint: "Compared with the previous 6 hours",
    },
    "24h": {
      label: "Last 24 hours",
      factor: 1,
      latency: 143.51,
      points: 16,
      hint: "Compared with yesterday",
    },
    "7d": {
      label: "Last 7 days",
      factor: 18420 / 2650,
      latency: 138.06,
      points: 7,
      hint: "Compared with the prior week",
    },
  };

  const STATUS = [
    { code: "200", share: 2360 / 2650, color: "#4c9aff" },
    { code: "201", share: 122 / 2650, color: "#3dd68c" },
    { code: "401", share: 74 / 2650, color: "#f5c451" },
    { code: "404", share: 28 / 2650, color: "#8b9cb3" },
    { code: "429", share: 40 / 2650, color: "#f472b6" },
    { code: "500", share: 26 / 2650, color: "#f87171" },
  ];

  const CONSUMER_SHARE = [
    { name: "Acme Mobile", share: 0.46, color: "#b07cff" },
    { name: "Lumen Checkout", share: 0.31, color: "#f5c451" },
    { name: "Partner Sandbox", share: 0.14, color: "#f472b6" },
    { name: "Internal Ops", share: 0.09, color: "#4c9aff" },
  ];

  const PALETTE = ["#b07cff", "#f5c451", "#f472b6", "#4c9aff", "#2ee6c7", "#fb7185", "#a3e635", "#38bdf8"];

  const SAMPLES = [
    ["POST", "/v1/payments", "payments-route", "payments-api", "Acme Mobile", 201, 128],
    ["GET", "/v1/catalog/items", "catalog-route", "catalog-api", "Lumen Checkout", 200, 64],
    ["POST", "/v1/auth/token", "auth-route", "identity-api", "Acme Mobile", 200, 41],
    ["GET", "/v1/search?q=ankara", "search-route", "search-api", "Partner Sandbox", 200, 210],
    ["POST", "/v1/notify", "notify-route", "notifications-api", "Internal Ops", 202, 88],
    ["GET", "/v1/usage", "billing-route", "billing-api", "Lumen Checkout", 200, 73],
    ["POST", "/v1/payments", "payments-route", "payments-api", "Partner Sandbox", 401, 12],
    ["GET", "/v1/catalog/missing", "catalog-route", "catalog-api", "Acme Mobile", 404, 22],
    ["POST", "/v1/notify", "notify-route", "notifications-api", "Partner Sandbox", 429, 8],
    ["PUT", "/v1/payments/re_2041", "payments-route", "payments-api", "Acme Mobile", 500, 840],
    ["GET", "/v1/search?q=damask", "search-route", "search-api", "Lumen Checkout", 200, 156],
    ["POST", "/v1/auth/token", "auth-route", "identity-api", "Unknown", 401, 9],
    ["GET", "/v1/catalog/items", "catalog-route", "catalog-api", "Internal Ops", 200, 58],
    ["POST", "/v1/payments", "payments-route", "payments-api", "Lumen Checkout", 201, 133],
  ];

  const state = {
    view: "monitor",
    range: "24h",
    live: true,
    requests: 2650,
    latencyJitter: 0,
    logQuery: "",
    logStatus: "all",
    error: null,
    issued: null,
    month: "2026-10",
    ipSeq: 4,
    logs: [],
    services: [
      svc("payments", "payments-api", "payments.internal", 0.37, "#b07cff", [
        target("10.8.1.12", "healthy", 42),
        target("10.8.1.18", "healthy", 47),
        target("10.8.1.24", "degraded", 318),
      ], "2m ago"),
      svc("identity", "identity-api", "identity.internal", 0.21, "#f5c451", [
        target("10.8.2.10", "healthy", 28),
        target("10.8.2.11", "healthy", 31),
      ], "2m ago"),
      svc("catalog", "catalog-api", "catalog.internal", 0.15, "#f472b6", [
        target("10.8.3.4", "healthy", 55),
        target("10.8.3.9", "healthy", 61),
      ], "5m ago"),
      svc("notify", "notifications-api", "notify.internal", 0.12, "#4c9aff", [
        target("10.8.4.2", "healthy", 70),
      ], "5m ago"),
      svc("billing", "billing-api", "billing.internal", 0.09, "#2ee6c7", [
        target("10.8.5.6", "healthy", 49),
        target("10.8.5.7", "healthy", 52),
      ], "8m ago"),
      svc("search", "search-api", "search.internal", 0.06, "#fb7185", [
        target("10.8.6.3", "healthy", 180),
        target("10.8.6.8", "healthy", 194),
      ], "8m ago"),
    ],
    routes: [
      route("payments-route", "/v1/payments", ["POST"], "payments-api", ["key-auth", "rate-limit"]),
      route("auth-route", "/v1/auth", ["GET", "POST"], "identity-api", ["jwt"]),
      route("catalog-route", "/v1/catalog", ["GET"], "catalog-api", ["key-auth"]),
      route("notify-route", "/v1/notify", ["POST"], "notifications-api", ["key-auth", "rate-limit"]),
      route("billing-route", "/v1/usage", ["GET"], "billing-api", ["jwt"]),
      route("search-route", "/v1/search", ["GET"], "search-api", ["key-auth", "rate-limit"]),
    ],
    consumers: [
      consumer("c1", "Acme Mobile", "API key", "mdn_live_8f3a…", "2m ago"),
      consumer("c2", "Lumen Checkout", "JWT", "jwt_1c90…", "14m ago"),
      consumer("c3", "Partner Sandbox", "API key", "mdn_test_11c0…", "1h ago"),
      consumer("c4", "Internal Ops", "API key", "mdn_live_04ee…", "4m ago"),
    ],
    limits: [
      limit("lim-payments", "payments-route", "route", 600, 412),
      limit("lim-notify", "notify-route", "route", 120, 96),
      limit("lim-acme", "Acme Mobile", "consumer", 2000, 840),
      limit("lim-sandbox", "Partner Sandbox", "consumer", 60, 58),
    ],
    billing: {
      "2026-10": {
        label: "October 2026",
        rows: [
          ["Acme Mobile", 612400],
          ["Lumen Checkout", 401200],
          ["Partner Sandbox", 188900],
          ["Internal Ops", 81900],
        ],
      },
      "2026-09": {
        label: "September 2026",
        rows: [
          ["Acme Mobile", 460000],
          ["Lumen Checkout", 310000],
          ["Partner Sandbox", 140000],
          ["Internal Ops", 70000],
        ],
      },
    },
  };

  const content = document.getElementById("content");
  const viewTitle = document.getElementById("view-title");
  const toastEl = document.getElementById("toast");
  let toastTimer = 0;

  function svc(id, name, host, weight, color, targets, checked) {
    return { id, name, host, port: 443, protocol: "https", weight, color, targets, checked };
  }

  function target(host, health, ms) {
    return { host, port: 443, health, ms };
  }

  function route(name, path, methods, service, plugins) {
    return { id: name, name, path, methods, service, plugins, enabled: true };
  }

  function consumer(id, name, auth, prefix, seen) {
    return { id, name, auth, prefix, status: "active", seen };
  }

  function limit(id, name, scope, max, used) {
    return { id, name, scope, limit: max, window: "minute", used };
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function compact(n) {
    if (n < 1000) return n.toLocaleString("en-US");
    const unit = n >= 1000000 ? "M" : "k";
    const div = n >= 1000000 ? 1000000 : 1000;
    const digits = n >= 10000 && n < 1000000 ? 1 : 2;
    const str = (n / div)
      .toFixed(digits)
      .replace(/\.0+$/, "")
      .replace(/(\.\d)0$/, "$1");
    return str + unit;
  }

  function full(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function money(n) {
    return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
  }

  function hex(bytes) {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function seeded(seed) {
    let x = Math.abs(seed) % 233280;
    if (x === 0) x = 17;
    return () => {
      x = (x * 9301 + 49297) % 233280;
      return x / 233280;
    };
  }

  function wave(seed, n, base, amp) {
    const rnd = seeded(seed);
    return Array.from({ length: n }, (_, i) => {
      const wobble = Math.sin(i * 0.9) * amp * 0.55;
      return Math.max(8, Math.round(base + wobble + (rnd() - 0.5) * amp));
    });
  }

  function hashSeed(str) {
    return [...str].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  }

  function countsFromShares(shares, total) {
    const counts = shares.map((share) => Math.floor(share * total));
    let used = counts.reduce((sum, n) => sum + n, 0);
    const order = shares
      .map((share, i) => ({ i, frac: share * total - counts[i] }))
      .sort((a, b) => b.frac - a.frac);
    let k = 0;
    while (used < total && order.length) {
      counts[order[k % order.length].i] += 1;
      used += 1;
      k += 1;
    }
    return counts;
  }

  function percents(counts) {
    const total = counts.reduce((sum, n) => sum + n, 0);
    if (!total) return counts.map(() => 0);
    const raw = counts.map((n) => (n / total) * 100);
    const base = raw.map((n) => Math.floor(n));
    let left = 100 - base.reduce((sum, n) => sum + n, 0);
    const order = raw
      .map((n, i) => ({ i, frac: n - Math.floor(n) }))
      .sort((a, b) => b.frac - a.frac);
    let k = 0;
    while (left > 0) {
      base[order[k % order.length].i] += 1;
      left -= 1;
      k += 1;
    }
    return base;
  }

  function badge(text, kind) {
    return `<span class="badge ${kind}">${escapeHtml(text)}</span>`;
  }

  function statusKind(code) {
    if (code >= 500) return "bad";
    if (code >= 400) return "warn";
    return "ok";
  }

  function bucket(code) {
    if (code >= 500) return "5xx";
    if (code >= 400) return "4xx";
    return "2xx";
  }

  function shortName(name) {
    return name.replace(/-api$/, "").slice(0, 12);
  }

  function meterClass(used, max) {
    const ratio = max > 0 ? used / max : 1;
    if (ratio >= 1) return "hot";
    if (ratio >= 0.85) return "warn";
    return "";
  }

  function errorFor(form) {
    if (!state.error || state.error.form !== form) return "";
    return `<p class="form-error">${escapeHtml(state.error.message)}</p>`;
  }

  function setError(form, message) {
    state.error = { form, message };
    render();
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  function rangeMeta() {
    return RANGES[state.range];
  }

  function shownRequests() {
    return Math.max(1, Math.round(state.requests * rangeMeta().factor));
  }

  function clientIp(i) {
    const block = i % 2 === 0 ? "203.0.113" : "198.51.100";
    return `${block}.${(i * 17) % 200 + 8}`;
  }

  function stamp(ts) {
    return new Date(ts).toLocaleString("en-GB", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  function seedLogs() {
    const now = Date.now();
    state.logs = SAMPLES.map((row, i) => ({
      id: "log-" + i,
      method: row[0],
      path: row[1],
      route: row[2],
      service: row[3],
      consumer: row[4],
      status: row[5],
      latency: row[6],
      ts: now - i * 47000,
      ip: clientIp(i + 3),
      fresh: false,
    }));
  }

  function pushLog() {
    const row = SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
    state.logs.forEach((log) => {
      log.fresh = false;
    });
    state.logs.unshift({
      id: uid("log"),
      method: row[0],
      path: row[1],
      route: row[2],
      service: row[3],
      consumer: row[4],
      status: row[5],
      latency: row[6],
      ts: Date.now(),
      ip: clientIp(state.logs.length + 9),
      fresh: true,
    });
    state.logs = state.logs.slice(0, 30);
  }

  function filteredLogs() {
    const q = state.logQuery.trim().toLowerCase();
    return state.logs.filter((log) => {
      if (state.logStatus !== "all" && bucket(log.status) !== state.logStatus) return false;
      if (!q) return true;
      const hay = [log.method, log.path, log.route, log.service, log.consumer, log.status, log.ip]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  function donut(slices) {
    const r = 52;
    const c = 2 * Math.PI * r;
    let acc = 0;
    const arcs = slices
      .map((slice) => {
        const frac = slice.pct / 100;
        const pad = slices.length > 1 ? 1.6 : 0;
        const dash = Math.max(0, frac * c - pad);
        const gap = c - dash;
        const draw = `<circle cx="80" cy="80" r="${r}" fill="none" stroke="${slice.color}" stroke-width="16" stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}" stroke-dashoffset="${(-acc * c).toFixed(2)}" transform="rotate(-90 80 80)"></circle>`;
        acc += frac;
        return draw;
      })
      .join("");
    const top = slices[0] || { pct: 0, label: "—" };
    return `<svg class="donut" viewBox="0 0 160 160" role="img" aria-label="${escapeHtml(
      slices.map((slice) => `${slice.label} ${slice.pct}%`).join(", ")
    )}">
      ${arcs}
      <circle cx="80" cy="80" r="38" fill="#171b22"></circle>
      <text class="donut-value" x="80" y="78" text-anchor="middle">${top.pct}%</text>
      <text class="donut-label" x="80" y="96" text-anchor="middle">${escapeHtml(top.label)}</text>
    </svg>`;
  }

  function legend(slices) {
    return `<ul class="legend">${slices
      .map(
        (slice) => `<li>
          <span><i class="swatch" style="background:${slice.color}"></i>${escapeHtml(slice.label)}</span>
          <span>${full(slice.count)} · ${slice.pct}%</span>
        </li>`
      )
      .join("")}</ul>`;
  }

  function slicesFrom(items, total) {
    const counts = countsFromShares(
      items.map((item) => item.share),
      total
    );
    const pct = percents(counts);
    return items.map((item, i) => ({
      label: item.label || item.code || item.name,
      color: item.color,
      count: counts[i],
      pct: pct[i],
    }));
  }

  function lineChart(series) {
    const w = 360;
    const h = 132;
    const pad = 8;
    const all = series.flatMap((item) => item.values);
    const max = Math.max(...all, 1) * 1.12;
    const innerW = w - pad * 2;
    const innerH = h - 22;
    const x = (i, n) => pad + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const y = (v) => 8 + (1 - v / max) * innerH;
    const grid = [0.5, 1]
      .map((g) => {
        const gy = y(max * g * 0.9);
        return `<line x1="${pad}" y1="${gy.toFixed(1)}" x2="${w - pad}" y2="${gy.toFixed(1)}" stroke="#243041" stroke-dasharray="2 4"></line>`;
      })
      .join("");
    const paths = series
      .map((item) => {
        const d = item.values
          .map((v, i) => `${i ? "L" : "M"}${x(i, item.values.length).toFixed(1)},${y(v).toFixed(1)}`)
          .join(" ");
        return `<path d="${d}" fill="none" stroke="${item.color}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"></path>`;
      })
      .join("");
    const label = series.map((item) => item.name).join(", ");
    return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Latency for ${escapeHtml(label)}">
      ${grid}
      <line x1="${pad}" y1="${h - 14}" x2="${w - pad}" y2="${h - 14}" stroke="#2a3342"></line>
      ${paths}
    </svg>
    <div class="chart-legend">${series
      .map(
        (item) =>
          `<span><i class="swatch" style="background:${item.color}"></i>${escapeHtml(item.name)}</span>`
      )
      .join("")}</div>`;
  }

  function monitorView() {
    const meta = rangeMeta();
    const requests = shownRequests();
    const services = [...state.services].sort((a, b) => b.weight - a.weight).slice(0, 6);
    const weightSum = services.reduce((sum, item) => sum + item.weight, 0) || 1;
    const serviceCounts = countsFromShares(
      services.map((item) => item.weight / weightSum),
      requests
    );
    const maxCount = Math.max(...serviceCounts, 1);
    const statusSlices = slicesFrom(STATUS, requests).sort((a, b) => b.count - a.count);
    const consumerSlices = slicesFrom(CONSUMER_SHARE, requests);
    const errors = statusSlices
      .filter((slice) => Number(slice.label) >= 400)
      .reduce((sum, slice) => sum + slice.count, 0);
    const errorRate = ((errors / requests) * 100).toFixed(1);
    const latency = Math.max(1, meta.latency + state.latencyJitter);
    const n = meta.points;
    const latencyServices = services.slice(0, 4).map((item) => ({
      name: shortName(item.name),
      color: item.color,
      values: wave(hashSeed(item.id + state.range), n, 70 + hashSeed(item.id) % 40, 36),
    }));
    const latencyRoutes = state.routes.slice(0, 4).map((item, index) => ({
      name: item.name.replace("-route", ""),
      color: PALETTE[index % PALETTE.length],
      values: wave(hashSeed(item.id + state.range + "r"), n, 60 + index * 18, 28),
    }));
    const upstream = wave(80 + n, n, 46, 16);
    upstream[Math.max(0, n - 3)] = 236;
    const proxy = wave(90 + n, n, 28, 10);

    const bars = services
      .map((item, i) => {
        const count = serviceCounts[i];
        const height = Math.max(4, (count / maxCount) * 100);
        return `<div class="bar-col" title="${escapeHtml(item.name)}: ${full(count)} requests">
          <span class="bar-value">${compact(count)}</span>
          <div class="bar-track"><div class="bar-fill" style="height:${height}%;background:${item.color}"></div></div>
          <span class="bar-label">${escapeHtml(shortName(item.name))}</span>
        </div>`;
      })
      .join("");

    const logs = filteredLogs();
    const logRows = logs.length
      ? logs
          .map(
            (log) => `<tr class="${log.fresh ? "fresh" : ""}">
              <td class="mono">${escapeHtml(stamp(log.ts))}</td>
              <td><span class="method ${escapeHtml(log.method)}">${escapeHtml(log.method)}</span></td>
              <td class="path">${escapeHtml(log.path)}</td>
              <td>${escapeHtml(log.route)}</td>
              <td>${escapeHtml(log.service)}</td>
              <td>${escapeHtml(log.consumer)}</td>
              <td>${badge(String(log.status), statusKind(log.status))}</td>
              <td class="mono">${log.latency} ms</td>
              <td class="mono">${escapeHtml(log.ip)}</td>
            </tr>`
          )
          .join("")
      : `<tr><td class="empty" colspan="9">No requests match that filter.</td></tr>`;

    return `<div class="stack">
      <div class="toolbar">
        <div class="segmented" role="group" aria-label="Time range">
          ${Object.entries(RANGES)
            .map(
              ([key, value]) =>
                `<button type="button" data-action="range" data-range="${key}" aria-pressed="${
                  state.range === key
                }">${value.label.replace("Last ", "")}</button>`
            )
            .join("")}
        </div>
        <button type="button" class="btn btn-ghost btn-small" data-action="live" aria-pressed="${state.live}">
          <span class="pulse ${state.live ? "" : "off"}" aria-hidden="true"></span>
          ${state.live ? "Live" : "Paused"}
        </button>
      </div>
      <section class="stat-row" aria-label="Gateway totals">
        <article class="panel stat">
          <p class="stat-label">API requests</p>
          <p class="stat-value">${compact(requests)}</p>
          <p class="stat-hint">${escapeHtml(meta.hint)}</p>
        </article>
        <article class="panel stat">
          <p class="stat-label">Proxy latency</p>
          <p class="stat-value">${latency.toFixed(2)}<span>ms</span></p>
          <p class="stat-hint">Average at the edge</p>
        </article>
        <article class="panel stat">
          <p class="stat-label">Errors</p>
          <p class="stat-value">${full(errors)}</p>
          <p class="stat-hint">${errorRate}% of requests</p>
        </article>
      </section>
      <section class="chart-row">
        <article class="panel">
          <h2 class="panel-title">Requests per service</h2>
          <div class="bars" aria-label="Request volume by service">${bars}</div>
        </article>
        <article class="panel">
          <h2 class="panel-title">Status codes</h2>
          <div class="split">${donut(statusSlices)}${legend(statusSlices)}</div>
        </article>
        <article class="panel">
          <h2 class="panel-title">Requests by consumer</h2>
          <div class="split">${donut(consumerSlices)}${legend(consumerSlices)}</div>
        </article>
      </section>
      <section>
        <h2 class="section-label">Latency</h2>
        <div class="latency-row">
          <article class="panel">
            <h3 class="panel-title">Latency by service</h3>
            ${lineChart(latencyServices)}
          </article>
          <article class="panel">
            <h3 class="panel-title">Latency by route</h3>
            ${lineChart(latencyRoutes)}
          </article>
          <article class="panel">
            <h3 class="panel-title">Upstream latency</h3>
            ${lineChart([
              { name: "Upstream", color: "#4c9aff", values: upstream },
              { name: "Proxy", color: "#2ee6c7", values: proxy },
            ])}
          </article>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <h2 class="panel-title">Edge requests · ${logs.length}</h2>
          <div class="log-tools">
            <label class="sr-only" for="log-search">Filter requests</label>
            <input id="log-search" type="search" placeholder="Filter path, consumer, service" value="${escapeHtml(
              state.logQuery
            )}" autocomplete="off" spellcheck="false" />
            <label class="sr-only" for="log-status">Status group</label>
            <select id="log-status" aria-label="Status group">
              ${["all", "2xx", "4xx", "5xx"]
                .map(
                  (value) =>
                    `<option value="${value}"${state.logStatus === value ? " selected" : ""}>${
                      value === "all" ? "All statuses" : value
                    }</option>`
                )
                .join("")}
            </select>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Method</th>
                <th scope="col">Path</th>
                <th scope="col">Route</th>
                <th scope="col">Service</th>
                <th scope="col">Consumer</th>
                <th scope="col">Status</th>
                <th scope="col">Latency</th>
                <th scope="col">Client</th>
              </tr>
            </thead>
            <tbody>${logRows}</tbody>
          </table>
        </div>
      </section>
    </div>`;
  }

  function routesView() {
    const options = state.services
      .map((item) => `<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`)
      .join("");
    const rows = state.routes
      .map((item) => {
        const plugins = item.plugins.length
          ? `<span class="plugins">${item.plugins
              .map((plugin) => `<span class="plugin">${escapeHtml(plugin)}</span>`)
              .join("")}</span>`
          : `<span class="fine">none</span>`;
        return `<tr class="${item.enabled ? "" : "paused"}">
          <td>${escapeHtml(item.name)}</td>
          <td class="path">${escapeHtml(item.path)}</td>
          <td>${item.methods.map((method) => `<span class="method ${method}">${method}</span>`).join(" ")}</td>
          <td>${escapeHtml(item.service)}</td>
          <td>${plugins}</td>
          <td>${item.enabled ? badge("Enabled", "ok") : badge("Paused", "neutral")}</td>
          <td><button type="button" class="btn btn-ghost btn-small" data-action="toggle-route" data-id="${escapeHtml(
            item.id
          )}">${item.enabled ? "Pause" : "Enable"}</button></td>
        </tr>`;
      })
      .join("");

    return `<p class="lead">Publish a path, attach it to a discovered service, and choose the plugins that run at the edge.</p>
      <form class="panel form" id="form-route" novalidate>
        <div class="form-row">
          <label class="field"><span>Route name</span><input name="name" placeholder="refunds-route" autocomplete="off" /></label>
          <label class="field"><span>Path</span><input name="path" placeholder="/v1/refunds" autocomplete="off" /></label>
          <label class="field"><span>Service</span><select name="service">${options}</select></label>
          <button class="btn btn-primary" type="submit">Publish route</button>
        </div>
        <div class="toolbar" style="margin-top:0.8rem">
          <span class="check-label">Methods</span>
          <div class="checks">
            ${["GET", "POST", "PUT", "PATCH", "DELETE"]
              .map(
                (method) =>
                  `<label><input type="checkbox" name="method" value="${method}"${
                    method === "POST" ? " checked" : ""
                  } /> ${method}</label>`
              )
              .join("")}
          </div>
          <span class="check-label">Plugins</span>
          <div class="checks">
            <label><input type="checkbox" name="plugin" value="key-auth" checked /> key-auth</label>
            <label><input type="checkbox" name="plugin" value="rate-limit" /> rate-limit</label>
          </div>
        </div>
        ${errorFor("route")}
      </form>
      <section class="panel">
        <h2 class="panel-title">Routes · ${state.routes.length}</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Path</th>
                <th scope="col">Methods</th>
                <th scope="col">Service</th>
                <th scope="col">Plugins</th>
                <th scope="col">State</th>
                <th scope="col"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`;
  }

  function servicesView() {
    const cards = state.services
      .map((item) => {
        const healthy = item.targets.filter((row) => row.health === "healthy").length;
        const targets = item.targets
          .map(
            (row) => `<li>
              <span class="health"><i class="dot ${row.health}"></i>${escapeHtml(row.health)}</span>
              <span>${escapeHtml(row.host)}:${row.port}</span>
              <span>${row.ms} ms</span>
            </li>`
          )
          .join("");
        return `<article class="panel service-card">
          <div class="service-top">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="protocol">${escapeHtml(item.protocol)}</span>
          </div>
          <p class="host-line">${escapeHtml(item.host)}:${item.port}</p>
          <p class="fine">${healthy} of ${item.targets.length} targets healthy · checked ${escapeHtml(item.checked)}</p>
          <ul class="targets">${targets}</ul>
          <button type="button" class="btn btn-ghost btn-small" data-action="check-targets" data-id="${escapeHtml(
            item.id
          )}">Check targets</button>
        </article>`;
      })
      .join("");

    return `<p class="lead">Upstreams the gateway can resolve. Target health is checked from the edge, not from the public internet.</p>
      <form class="panel form" id="form-service" novalidate>
        <div class="form-row services">
          <label class="field"><span>Service name</span><input name="name" placeholder="orders-api" autocomplete="off" /></label>
          <label class="field"><span>Internal host</span><input name="host" placeholder="orders.internal" autocomplete="off" /></label>
          <label class="field"><span>Port</span><input name="port" inputmode="numeric" placeholder="443" value="443" /></label>
          <button class="btn btn-primary" type="submit">Register</button>
        </div>
        ${errorFor("service")}
      </form>
      <div class="card-grid">${cards}</div>`;
  }

  function consumersView() {
    const reveal = state.issued
      ? `<aside class="key-reveal">
          <div>
            <strong>${escapeHtml(state.issued.name)} · ${escapeHtml(state.issued.auth)}</strong>
            <p>Copy this secret now. Meridian will not show it again after you dismiss it.</p>
            <code>${escapeHtml(state.issued.secret)}</code>
          </div>
          <div class="key-actions">
            <button type="button" class="btn btn-primary btn-small" data-action="copy-key">Copy</button>
            <button type="button" class="btn btn-ghost btn-small" data-action="dismiss-key">Dismiss</button>
          </div>
        </aside>`
      : "";
    const rows = state.consumers
      .map((item) => {
        const stateBadge =
          item.status === "active" ? badge("Active", "ok") : badge("Revoked", "bad");
        const action =
          item.status === "active"
            ? `<button type="button" class="btn btn-danger btn-small" data-action="revoke" data-id="${escapeHtml(
                item.id
              )}">Revoke</button>`
            : "";
        return `<tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.auth)}</td>
          <td class="mono">${escapeHtml(item.prefix)}</td>
          <td>${stateBadge}</td>
          <td>${escapeHtml(item.seen)}</td>
          <td>${action}</td>
        </tr>`;
      })
      .join("");

    return `<p class="lead">Credentials for apps calling the gateway. A secret is shown once, when it is issued.</p>
      ${reveal}
      <form class="panel form" id="form-consumer" novalidate>
        <div class="form-row consumers">
          <label class="field"><span>Consumer</span><input name="name" placeholder="Northwind" autocomplete="off" /></label>
          <label class="field"><span>Credential</span>
            <select name="auth">
              <option value="API key">API key</option>
              <option value="JWT">JWT</option>
            </select>
          </label>
          <button class="btn btn-primary" type="submit">Issue credential</button>
        </div>
        ${errorFor("consumer")}
      </form>
      <section class="panel">
        <h2 class="panel-title">Consumers · ${state.consumers.length}</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Consumer</th>
                <th scope="col">Auth</th>
                <th scope="col">Prefix</th>
                <th scope="col">State</th>
                <th scope="col">Last seen</th>
                <th scope="col"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`;
  }

  function limitsView() {
    const rows = state.limits
      .map((item) => {
        const ratio = item.limit > 0 ? Math.min(100, (item.used / item.limit) * 100) : 100;
        const over = item.used > item.limit;
        return `<tr>
          <td>${escapeHtml(item.name)}</td>
          <td>${escapeHtml(item.scope)}</td>
          <td>
            <div class="usage-cell">
              <div class="meter ${meterClass(item.used, item.limit)}" aria-hidden="true"><span style="width:${ratio}%"></span></div>
              <span class="mono">${full(item.used)} / ${full(item.limit)}</span>
            </div>
            ${over ? `<p class="fine">Over limit in this window</p>` : ""}
          </td>
          <td>per ${escapeHtml(item.window)}</td>
          <td>
            <div class="limit-edit">
              <label class="sr-only" for="limit-${escapeHtml(item.id)}">New limit for ${escapeHtml(item.name)}</label>
              <input id="limit-${escapeHtml(item.id)}" data-limit-input="${escapeHtml(item.id)}" type="number" min="1" max="100000" value="${
                item.limit
              }" />
              <button type="button" class="btn btn-ghost btn-small" data-action="save-limit" data-id="${escapeHtml(
                item.id
              )}">Save</button>
            </div>
          </td>
        </tr>`;
      })
      .join("");

    return `<p class="lead">Windows are counted at the edge. A policy can sit on a route or on a consumer.</p>
      <section class="panel">
        <h2 class="panel-title">Policies · ${state.limits.length}</h2>
        <div class="table-wrap">
          <table class="limits-table">
            <thead>
              <tr>
                <th scope="col">Policy</th>
                <th scope="col">Scope</th>
                <th scope="col">This window</th>
                <th scope="col">Window</th>
                <th scope="col">Limit</th>
              </tr>
            </thead>
            <tbody>${rows || `<tr><td class="empty" colspan="5">No rate limits yet. Publish a route with the rate-limit plugin.</td></tr>`}</tbody>
          </table>
        </div>
      </section>`;
  }

  function billingView() {
    const period = state.billing[state.month];
    const included = 1000000;
    const base = 490;
    const rate = 0.85;
    const totalReq = period.rows.reduce((sum, row) => sum + row[1], 0);
    const over = Math.max(0, totalReq - included);
    const overage = (over / 1000) * rate;
    const total = base + overage;
    const width = Math.min(100, (totalReq / included) * 100);
    const hot = over > 0;
    const rows = period.rows
      .map((row) => {
        const share = totalReq ? Math.round((row[1] / totalReq) * 100) : 0;
        return `<tr>
          <td>${escapeHtml(row[0])}</td>
          <td class="mono">${full(row[1])}</td>
          <td>${share}%</td>
        </tr>`;
      })
      .join("");
    const quotaNote = hot
      ? `${full(over)} requests over the plan`
      : `${full(included - totalReq)} requests left on the plan`;

    return `<p class="lead">Usage is metered per consumer and invoiced on the account plan. This is a demo invoice — nothing is charged.</p>
      <div class="toolbar">
        <div class="segmented" role="group" aria-label="Billing period">
          ${Object.entries(state.billing)
            .map(
              ([key, value]) =>
                `<button type="button" data-action="billing-month" data-month="${key}" aria-pressed="${
                  state.month === key
                }">${escapeHtml(value.label)}</button>`
            )
            .join("")}
        </div>
      </div>
      <div class="bill-grid">
        <section class="panel">
          <h2 class="panel-title">Usage · ${escapeHtml(period.label)}</h2>
          <div class="quota">
            <div class="quota-top">
              <span>Included on Growth</span>
              <span class="mono">${full(totalReq)} / ${full(included)}</span>
            </div>
            <div class="meter ${hot ? "hot" : ""}" aria-label="${quotaNote}"><span style="width:${width}%"></span></div>
            <p class="fine">${quotaNote}</p>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Consumer</th>
                  <th scope="col">Requests</th>
                  <th scope="col">Share</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </section>
        <section class="panel">
          <h2 class="panel-title">Invoice INV-${escapeHtml(state.month)}</h2>
          <div class="invoice">
            <div class="invoice-line"><span>Growth plan</span><span>${money(base)}</span></div>
            <div class="invoice-line"><span>Included requests</span><span>${full(included)}</span></div>
            <div class="invoice-line"><span>Overage · ${full(over)} × $0.85 / 1k</span><span>${money(overage)}</span></div>
            <div class="invoice-total"><span>Total</span><span>${money(total)}</span></div>
          </div>
          <div class="invoice-actions" style="margin-top:0.9rem">
            <button type="button" class="btn btn-primary" data-action="download-invoice">Download invoice</button>
          </div>
          <p class="fine">Overage is ${money(rate)} per 1,000 requests above the included volume.</p>
        </section>
      </div>`;
  }

  const VIEWS = {
    monitor: monitorView,
    routes: routesView,
    services: servicesView,
    consumers: consumersView,
    limits: limitsView,
    billing: billingView,
  };

  function render() {
    const view = VIEWS[state.view] ? state.view : "monitor";
    state.view = view;
    viewTitle.textContent = TITLES[view];
    document.title = `${TITLES[view]} — Meridian`;
    document.querySelectorAll(".nav-item").forEach((link) => {
      const on = link.dataset.view === view;
      link.classList.toggle("active", on);
      if (on) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    content.innerHTML = VIEWS[view]();
  }

  function viewFromHash() {
    const name = location.hash.replace("#", "");
    return TITLES[name] ? name : "monitor";
  }

  function slugName(value) {
    return /^[a-z0-9][a-z0-9-]{1,40}$/i.test(value);
  }

  function publishRoute(form) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const path = String(data.get("path") || "").trim();
    const service = String(data.get("service") || "");
    const methods = data.getAll("method").map(String);
    const plugins = data.getAll("plugin").map(String);
    if (!slugName(name)) {
      setError("route", "Use a route name of letters, numbers, and hyphens.");
      return;
    }
    if (!path.startsWith("/") || /\s/.test(path)) {
      setError("route", "Paths start with a slash, like /v1/refunds.");
      return;
    }
    if (!methods.length) {
      setError("route", "Pick at least one method.");
      return;
    }
    if (state.routes.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setError("route", "That route name is already in use.");
      return;
    }
    if (state.routes.some((item) => item.path === path)) {
      setError("route", "That path is already published.");
      return;
    }
    const created = { id: uid("route"), name, path, methods, service, plugins, enabled: true };
    state.routes.unshift(created);
    if (plugins.includes("rate-limit")) {
      state.limits.unshift(limit(uid("lim"), name, "route", 300, 0));
    }
    state.error = null;
    toast(plugins.includes("rate-limit") ? `${name} is live, with a 300 per minute limit.` : `${name} is live.`);
    render();
  }

  function registerService(form) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const host = String(data.get("host") || "").trim().toLowerCase();
    const port = Number(data.get("port"));
    if (!slugName(name)) {
      setError("service", "Name the service with letters, numbers, and hyphens.");
      return;
    }
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) {
      setError("service", "Add an internal host, like orders.internal.");
      return;
    }
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      setError("service", "Port should be between 1 and 65535.");
      return;
    }
    if (state.services.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setError("service", "That service is already registered.");
      return;
    }
    state.ipSeq += 1;
    const hostIp = `10.8.${state.ipSeq}.${10 + (state.ipSeq % 40)}`;
    state.services.unshift(
      svc(
        uid("svc"),
        name,
        host,
        0.08,
        PALETTE[state.services.length % PALETTE.length],
        [target(hostIp, "healthy", 36)],
        "just now"
      )
    );
    state.services[0].port = port;
    state.error = null;
    toast(`${name} registered with one healthy target.`);
    render();
  }

  function issueCredential(form) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim().replace(/\s+/g, " ");
    const auth = String(data.get("auth") || "API key");
    if (!/^[A-Za-z0-9][A-Za-z0-9 .'-]{1,40}$/.test(name)) {
      setError("consumer", "Name the consumer with letters and numbers.");
      return;
    }
    if (state.consumers.some((item) => item.name.toLowerCase() === name.toLowerCase() && item.status === "active")) {
      setError("consumer", "That consumer already has an active credential.");
      return;
    }
    const secret = auth === "JWT" ? `mdn_jwt_${hex(12)}` : `mdn_live_${hex(8)}`;
    const prefix = secret.slice(0, 12) + "…";
    const existing = state.consumers.find((item) => item.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.auth = auth;
      existing.prefix = prefix;
      existing.status = "active";
      existing.seen = "Just now";
    } else {
      state.consumers.unshift(consumer(uid("c"), name, auth, prefix, "Just now"));
    }
    state.issued = { name, auth, secret };
    state.error = null;
    toast(`Credential issued for ${name}. Copy it now.`);
    render();
  }

  function saveLimit(id) {
    const item = state.limits.find((row) => row.id === id);
    const input = content.querySelector(`[data-limit-input="${CSS.escape(id)}"]`);
    if (!item || !input) return;
    const next = Number(input.value);
    if (!Number.isInteger(next) || next < 1 || next > 100000) {
      toast("Use a limit between 1 and 100,000.");
      return;
    }
    item.limit = next;
    toast(`${item.name} limit set to ${full(next)} per ${item.window}.`);
    render();
  }

  function downloadInvoice() {
    const period = state.billing[state.month];
    const included = 1000000;
    const totalReq = period.rows.reduce((sum, row) => sum + row[1], 0);
    const over = Math.max(0, totalReq - included);
    const overage = (over / 1000) * 0.85;
    const lines = [
      "Meridian",
      `Invoice INV-${state.month}`,
      period.label,
      "",
      "Growth plan: $490.00",
      `Requests: ${full(totalReq)}`,
      `Included: ${full(included)}`,
      `Overage: ${full(over)} at $0.85 / 1,000 = ${money(overage)}`,
      `Total: ${money(490 + overage)}`,
      "",
      "Demo invoice. No charge is sent.",
      ...period.rows.map((row) => `${row[0]}: ${full(row[1])} requests`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `meridian-invoice-${state.month}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1500);
    toast(`Invoice for ${period.label} downloaded.`);
  }

  function checkTargets(id) {
    const item = state.services.find((row) => row.id === id);
    if (!item || !item.targets.length) return;
    const row = item.targets[item.targets.length - 1];
    if (row.health === "healthy") {
      row.health = "degraded";
      row.ms = 280 + Math.floor(Math.random() * 80);
      toast(`${item.name}: ${row.host} is degraded.`);
    } else {
      row.health = "healthy";
      row.ms = 30 + Math.floor(Math.random() * 30);
      toast(`${item.name}: ${row.host} recovered.`);
    }
    item.checked = "just now";
    render();
  }

  content.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    if (action === "range") {
      state.range = button.dataset.range;
      state.latencyJitter = 0;
      render();
      return;
    }
    if (action === "live") {
      state.live = !state.live;
      toast(state.live ? "Live tail resumed." : "Live tail paused.");
      render();
      return;
    }
    if (action === "toggle-route") {
      const item = state.routes.find((row) => row.id === button.dataset.id);
      if (!item) return;
      item.enabled = !item.enabled;
      toast(item.enabled ? `${item.name} enabled.` : `${item.name} paused.`);
      render();
      return;
    }
    if (action === "check-targets") {
      checkTargets(button.dataset.id);
      return;
    }
    if (action === "save-limit") {
      saveLimit(button.dataset.id);
      return;
    }
    if (action === "revoke") {
      const item = state.consumers.find((row) => row.id === button.dataset.id);
      if (!item) return;
      item.status = "revoked";
      toast(`${item.name} credential revoked.`);
      render();
      return;
    }
    if (action === "copy-key" && state.issued) {
      navigator.clipboard.writeText(state.issued.secret).then(
        () => toast("Credential copied."),
        () => toast("Copy the secret from the banner.")
      );
      return;
    }
    if (action === "dismiss-key") {
      state.issued = null;
      render();
      return;
    }
    if (action === "billing-month") {
      state.month = button.dataset.month;
      render();
      return;
    }
    if (action === "download-invoice") downloadInvoice();
  });

  content.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    event.preventDefault();
    if (form.id === "form-route") publishRoute(form);
    if (form.id === "form-service") registerService(form);
    if (form.id === "form-consumer") issueCredential(form);
  });

  content.addEventListener("input", (event) => {
    if (event.target.id !== "log-search") return;
    const pos = event.target.selectionStart;
    state.logQuery = event.target.value;
    render();
    const again = document.getElementById("log-search");
    if (!again) return;
    again.focus();
    again.setSelectionRange(pos, pos);
  });

  content.addEventListener("change", (event) => {
    if (event.target.id !== "log-status") return;
    state.logStatus = event.target.value;
    render();
  });

  window.addEventListener("hashchange", () => {
    state.view = viewFromHash();
    state.error = null;
    render();
  });

  function tick() {
    if (!state.live || state.view !== "monitor") return;
    const el = document.activeElement;
    if (el && (el.id === "log-search" || el.id === "log-status")) return;
    pushLog();
    state.requests += 1;
    state.latencyJitter = Math.round((Math.random() - 0.45) * 30) / 10;
    render();
  }

  seedLogs();
  state.view = viewFromHash();
  render();
  window.setInterval(tick, 4000);
})();
