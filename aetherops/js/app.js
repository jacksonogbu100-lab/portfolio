(() => {
  const state = {
    view: "overview",
    spend: 48320,
    health: 98.6,
    approvalRate: 94,
    activeAgents: 18,
    approvals: [
      {
        id: "a1",
        title: "Contract Review",
        agent: "Legal Copilot",
        priority: "high",
        status: "pending",
        age: "12m",
      },
      {
        id: "a2",
        title: "Invoice Agent",
        agent: "Finance Ops",
        priority: "ok",
        status: "pending",
        age: "28m",
      },
      {
        id: "a3",
        title: "Vendor Onboarding",
        agent: "Doc Agent",
        priority: "ok",
        status: "pending",
        age: "41m",
      },
    ],
    agents: [
      { name: "Support Copilot", version: "v2.4.1", health: 99, series: [42, 48, 45, 52, 58, 55, 61] },
      { name: "Doc Agent", version: "v1.9.0", health: 97, series: [38, 40, 44, 41, 47, 49, 53] },
      { name: "Proxy Agent", version: "v0.8.3", health: 95, series: [30, 34, 33, 39, 36, 42, 40] },
      { name: "Code Runner", version: "v3.1.2", health: 98, series: [50, 52, 49, 55, 57, 60, 58] },
    ],
    alerts: [
      { level: "critical", title: "High cost spike detected", detail: "May 24 · +38% vs baseline" },
      { level: "warn", title: "Fallback volume increased", detail: "Last 2h · 13% of runs" },
    ],
    costSeries: [1680, 1920, 1840, 2105, 1980, 2260, 2410, 2180, 2550, 2680, 2490, 2860],
    workflows: [
      { name: "Intake → Deliver", path: "Primary", share: "65%", health: "99.1%", latency: "1.8s" },
      { name: "Classify → Review", path: "Secondary", share: "22%", health: "97.4%", latency: "2.4s" },
      { name: "Fallback → Deliver", path: "Fallback", share: "13%", health: "94.8%", latency: "4.1s" },
    ],
  };

  const titles = {
    overview: "AI Workflow Command Center",
    workflows: "Workflow routing",
    agents: "Agent fleet",
    analytics: "Cost & evaluation",
    approvals: "Human approvals",
    settings: "Platform settings",
  };

  const content = document.getElementById("content");
  const viewTitle = document.getElementById("view-title");
  const approvalCount = document.getElementById("approval-count");
  const toast = document.getElementById("toast");

  function money(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function sparkline(series, color = "#38bdf8") {
    const w = 72;
    const h = 28;
    const max = Math.max(...series);
    const min = Math.min(...series);
    const span = max - min || 1;
    const points = series
      .map((v, i) => {
        const x = (i / (series.length - 1)) * (w - 2) + 1;
        const y = h - 2 - ((v - min) / span) * (h - 6);
        return `${x},${y}`;
      })
      .join(" ");
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="M${points.replace(/ /g, " L")}" style="stroke:${color}"/></svg>`;
  }

  function routeMap() {
    return `
      <div class="route-map" aria-label="Workflow routing map">
        <svg viewBox="0 0 640 280" role="img">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <path class="flow-line primary" filter="url(#glow)" d="M70 70 C160 70, 180 70, 250 70 S340 70, 390 70 S480 70, 570 70"/>
          <path class="flow-line secondary" filter="url(#glow)" d="M70 140 C160 140, 200 140, 250 140 S330 110, 390 110 S480 110, 570 110"/>
          <path class="flow-line fallback" d="M250 140 C300 180, 330 210, 390 210 S480 160, 570 140"/>

          ${stage(70, 70, "Intake", "100%")}
          ${stage(250, 70, "Classify", "88%")}
          ${stage(390, 70, "Review", "76%")}
          ${stage(390, 210, "Fallback", "13%")}
          ${stage(570, 90, "Deliver", "97%")}

          <circle class="check" cx="600" cy="90" r="7"/>
          <path d="M597 90l2.2 2.2 4.2-4.4" fill="none" stroke="#052e1f" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="route-legend">
        <span><i class="swatch primary"></i> Primary path 65%</span>
        <span><i class="swatch secondary"></i> Secondary path 22%</span>
        <span><i class="swatch fallback"></i> Fallback path 13%</span>
      </div>
    `;
  }

  function stage(x, y, label, sub) {
    return `
      <rect class="node" x="${x - 42}" y="${y - 22}" rx="10" width="84" height="44"/>
      <text class="node-label" x="${x}" y="${y - 2}" text-anchor="middle">${label}</text>
      <text class="node-sub" x="${x}" y="${y + 13}" text-anchor="middle">${sub}</text>
    `;
  }

  function kpiRow() {
    return `
      <section class="kpi-row" aria-label="Key metrics">
        <article class="kpi">
          <p class="kpi-label">Monthly spend</p>
          <p class="kpi-value">${money(state.spend)}</p>
          <p class="kpi-delta">↑ 12.4% vs last month</p>
        </article>
        <article class="kpi">
          <p class="kpi-label">Workflow health</p>
          <p class="kpi-value">${state.health.toFixed(1)}%</p>
          <p class="kpi-delta down">↓ 0.8% vs last week</p>
        </article>
        <article class="kpi">
          <p class="kpi-label">Approval rate</p>
          <p class="kpi-value">${state.approvalRate}%</p>
          <p class="kpi-delta">↑ 3.4% vs last week</p>
        </article>
        <article class="kpi">
          <p class="kpi-label">Active agents</p>
          <p class="kpi-value">${state.activeAgents}</p>
          <p class="kpi-delta">↑ 2 since last week</p>
        </article>
      </section>
    `;
  }

  function agentPanel() {
    return `
      <section class="panel">
        <div class="panel-head">
          <h2>Agent health</h2>
          <span class="panel-meta">Live</span>
        </div>
        <div class="panel-body agent-list">
          ${state.agents
            .slice(0, 3)
            .map(
              (a) => `
            <article class="agent-row">
              <div>
                <p class="agent-name">${a.name}</p>
                <p class="agent-meta">${a.version} · ${a.health}% uptime</p>
              </div>
              <div style="display:flex;align-items:center;gap:.55rem">
                ${sparkline(a.series)}
                <span class="badge healthy">Healthy</span>
              </div>
            </article>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function alertPanel() {
    return `
      <section class="panel">
        <div class="panel-head">
          <h2>System alerts</h2>
          <span class="panel-meta">${state.alerts.length} open</span>
        </div>
        <div class="panel-body alert-list">
          ${state.alerts
            .map(
              (a) => `
            <article class="alert-row">
              <div>
                <p class="agent-name">${a.title}</p>
                <p class="alert-meta">${a.detail}</p>
              </div>
              <span class="badge ${a.level}">${a.level === "critical" ? "Critical" : "Warning"}</span>
            </article>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function approvalPanel() {
    const pending = state.approvals.filter((a) => a.status === "pending");
    if (!pending.length) {
      return `
        <section class="panel">
          <div class="panel-head"><h2>Approval queue</h2></div>
          <div class="panel-body"><p class="empty">Queue clear — agents are shipping unattended.</p></div>
        </section>
      `;
    }
    return `
      <section class="panel">
        <div class="panel-head">
          <h2>Approval queue</h2>
          <span class="panel-meta">${pending.length} waiting</span>
        </div>
        <div class="panel-body approval-list">
          ${pending
            .map(
              (a) => `
            <article class="approval-row" data-id="${a.id}">
              <div>
                <p class="approval-title">${a.title}</p>
                <p class="approval-meta">${a.agent} · ${a.age} ago</p>
              </div>
              <div class="approval-actions">
                <span class="badge ${a.priority}">${a.priority === "high" ? "High" : "Ready"}</span>
                <button class="btn btn-soft" type="button" data-action="approve">Approve</button>
                <button class="btn btn-danger" type="button" data-action="reject">Reject</button>
              </div>
            </article>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function costPanel() {
    return `
      <section class="panel">
        <div class="panel-head">
          <h2>Cost pulse</h2>
          <span class="panel-meta">${money(state.spend)} MTD</span>
        </div>
        <div class="panel-body">
          <div class="chart-wrap"><canvas id="cost-chart" width="640" height="160" aria-label="Daily spend chart"></canvas></div>
          <div class="chart-caption"><span>May 13</span><span>Peak $2,860 · May 24</span><span>May 24</span></div>
        </div>
      </section>
    `;
  }

  function deployCard() {
    return `
      <aside class="deploy-card">
        <h3>Deploy smarter routes</h3>
        <p>Optimize performance, cost, and reliability with intelligent agent routing.</p>
        <button class="btn btn-primary" type="button" id="btn-deploy">Deploy route</button>
      </aside>
    `;
  }

  function renderOverview() {
    return `
      ${kpiRow()}
      <div class="grid-main">
        <section class="panel">
          <div class="panel-head">
            <h2>Workflow routing map</h2>
            <span class="panel-meta">Live traffic · last 24h</span>
          </div>
          <div class="panel-body">${routeMap()}</div>
        </section>
        <div class="stack">
          ${approvalPanel()}
          ${deployCard()}
        </div>
      </div>
      <div class="grid-main">
        ${agentPanel()}
        <div class="stack">
          ${alertPanel()}
          ${costPanel()}
        </div>
      </div>
    `;
  }

  function renderWorkflows() {
    return `
      <div class="view-block">
        <section class="panel">
          <div class="panel-head">
            <h2>Routing map</h2>
            <span class="panel-meta">Orchestration graph</span>
          </div>
          <div class="panel-body">${routeMap()}</div>
        </section>
        <section class="panel">
          <div class="panel-head"><h2>Path evaluation</h2></div>
          <div class="panel-body" style="overflow-x:auto">
            <table class="table">
              <thead>
                <tr><th>Workflow</th><th>Path</th><th>Share</th><th>Health</th><th>P50 latency</th></tr>
              </thead>
              <tbody>
                ${state.workflows
                  .map(
                    (w) => `
                  <tr>
                    <td>${w.name}</td>
                    <td class="mono">${w.path}</td>
                    <td class="mono">${w.share}</td>
                    <td class="mono">${w.health}</td>
                    <td class="mono">${w.latency}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  function renderAgents() {
    return `
      <div class="view-block">
        ${kpiRow()}
        <section class="panel">
          <div class="panel-head">
            <h2>Fleet status</h2>
            <span class="panel-meta">${state.agents.length} registered</span>
          </div>
          <div class="panel-body agent-list">
            ${state.agents
              .map(
                (a) => `
              <article class="agent-row">
                <div>
                  <p class="agent-name">${a.name}</p>
                  <p class="agent-meta">${a.version} · tools, APIs, code runners</p>
                </div>
                <div style="display:flex;align-items:center;gap:.55rem">
                  ${sparkline(a.series, "#8b5cf6")}
                  <span class="badge healthy">${a.health}% healthy</span>
                </div>
              </article>
            `
              )
              .join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderAnalytics() {
    return `
      <div class="view-block">
        ${kpiRow()}
        <div class="grid-main">
          ${costPanel()}
          ${alertPanel()}
        </div>
      </div>
    `;
  }

  function renderApprovals() {
    return `
      <div class="view-block">
        ${approvalPanel()}
        <section class="panel">
          <div class="panel-head"><h2>Governance</h2></div>
          <div class="panel-body">
            <p style="margin:0;color:var(--muted);max-width:52ch">
              High-risk steps pause for a human. Agents keep planning, calling tools, writing code,
              and searching data — you only step in when policy requires it.
            </p>
          </div>
        </section>
      </div>
    `;
  }

  function renderSettings() {
    return `
      <div class="view-block">
        <section class="panel">
          <div class="panel-head"><h2>Platform settings</h2></div>
          <div class="panel-body" style="overflow-x:auto">
            <table class="table">
              <tbody>
                <tr><th>Stack</th><td>LLMs · Python · APIs · Agent orchestration · Evaluation</td></tr>
                <tr><th>Intervention</th><td>Human-in-the-loop for high-risk approvals only</td></tr>
                <tr><th>Routing</th><td>Primary / secondary / fallback with cost-aware selection</td></tr>
                <tr><th>Observability</th><td>Agent health, cost pulse, workflow evaluation</td></tr>
                <tr><th>Demo mode</th><td>Browser-only simulation — no live model calls</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  const renderers = {
    overview: renderOverview,
    workflows: renderWorkflows,
    agents: renderAgents,
    analytics: renderAnalytics,
    approvals: renderApprovals,
    settings: renderSettings,
  };

  function drawCostChart() {
    const canvas = document.getElementById("cost-chart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth || 640;
    const cssH = canvas.clientHeight || 160;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const series = state.costSeries;
    const pad = { t: 12, r: 8, b: 10, l: 8 };
    const w = cssW - pad.l - pad.r;
    const h = cssH - pad.t - pad.b;
    const max = Math.max(...series) * 1.08;
    const min = Math.min(...series) * 0.9;

    ctx.clearRect(0, 0, cssW, cssH);

    ctx.strokeStyle = "rgba(148,176,255,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const y = pad.t + (h / 3) * i;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(pad.l + w, y);
      ctx.stroke();
    }

    const points = series.map((v, i) => {
      const x = pad.l + (i / (series.length - 1)) * w;
      const y = pad.t + (1 - (v - min) / (max - min)) * h;
      return { x, y };
    });

    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + h);
    grad.addColorStop(0, "rgba(139,92,246,0.35)");
    grad.addColorStop(1, "rgba(139,92,246,0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, pad.t + h);
    points.forEach((p) => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, pad.t + h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2.4;
    ctx.shadowColor = "rgba(139,92,246,0.55)";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    const peak = points.reduce((best, p, i) => (series[i] > series[best] ? i : best), 0);
    ctx.beginPath();
    ctx.arc(points[peak].x, points[peak].y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();
  }

  function updateBadge() {
    const n = state.approvals.filter((a) => a.status === "pending").length;
    approvalCount.textContent = String(n);
    approvalCount.hidden = n === 0;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function bindViewEvents() {
    content.querySelectorAll("[data-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest("[data-id]");
        const id = row?.dataset.id;
        const action = btn.dataset.action;
        const item = state.approvals.find((a) => a.id === id);
        if (!item) return;
        item.status = action === "approve" ? "approved" : "rejected";
        state.approvalRate = Math.min(99, state.approvalRate + (action === "approve" ? 1 : 0));
        showToast(action === "approve" ? `${item.title} approved` : `${item.title} rejected`);
        updateBadge();
        render();
      });
    });

    const deploy = content.querySelector("#btn-deploy");
    if (deploy) {
      deploy.addEventListener("click", () => {
        state.health = Math.min(99.9, +(state.health + 0.3).toFixed(1));
        showToast("Smarter route deployed across primary and fallback paths");
        render();
      });
    }

    requestAnimationFrame(drawCostChart);
  }

  function render() {
    viewTitle.textContent = titles[state.view];
    content.innerHTML = renderers[state.view]();
    updateBadge();
    bindViewEvents();
  }

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b === btn));
      render();
    });
  });

  document.getElementById("btn-deploy-top").addEventListener("click", () => {
    state.health = Math.min(99.9, +(state.health + 0.2).toFixed(1));
    showToast("Route pack published to production agents");
    if (state.view === "overview" || state.view === "workflows") render();
  });

  document.getElementById("btn-sim").addEventListener("click", () => {
    state.spend += Math.floor(40 + Math.random() * 120);
    state.activeAgents = Math.min(24, state.activeAgents + (Math.random() > 0.6 ? 1 : 0));
    state.costSeries = state.costSeries.slice(1).concat(Math.floor(2100 + Math.random() * 800));
    state.agents.forEach((a) => {
      a.series = a.series.slice(1).concat(Math.floor(35 + Math.random() * 30));
    });
    showToast("Simulated agent run completed across intake → deliver");
    render();
  });

  window.addEventListener("resize", () => requestAnimationFrame(drawCostChart));

  render();
})();
