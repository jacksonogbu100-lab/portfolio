// ════════════════════════════════════════════
// ⚠️  ADD YOUR SUPABASE CREDENTIALS TO GO LIVE
// ════════════════════════════════════════════
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_PUBLIC_KEY";
// ════════════════════════════════════════════

// Demo mode — runs with sample data if no Supabase credentials
const DEMO_MODE = SUPABASE_URL.includes("YOUR_PROJECT");
let sb = null;
if (!DEMO_MODE) {
  // Only init if script loaded
  try {
    sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (e) {}
}

function dateOffset(days = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

// ── SAMPLE DATA (demo mode) ──
let orders = [
  {
    id: "ORD-001",
    customer: "Margaret",
    phone: "09036954022",
    items: "Suit Jacket",
    service: "Dry Cleaning",
    qty: 2,
    status: "Ready",
    due: dateOffset(1),
    total: 12000,
    paid: false,
    assigned: "Rosa P.",
    notes: "",
  },
  {
    id: "ORD-002",
    customer: "James Okafor",
    phone: "09035954023",
    items: "Dress",
    service: "Dry Cleaning",
    qty: 1,
    status: "Processing",
    due: dateOffset(2),
    total: 8000,
    paid: false,
    assigned: "Dev K.",
    notes: "Handle gently",
  },
  {
    id: "ORD-003",
    customer: "Precious Naira",
    phone: "09036954024",
    items: "Shirt",
    service: "Laundry",
    qty: 5,
    status: "Pending",
    due: dateOffset(3),
    total: 12500,
    paid: true,
    assigned: "",
    notes: "",
  },
  {
    id: "ORD-004",
    customer: "Tony max",
    phone: "09036954025",
    items: "Coat",
    service: "Dry Cleaning",
    qty: 1,
    status: "Ready",
    due: dateOffset(1),
    total: 10000,
    paid: false,
    assigned: "Rose P.",
    notes: "",
  },
  {
    id: "ORD-005",
    customer: "Sofia r",
    phone: "09036954026",
    items: "Trousers",
    service: "Pressing",
    qty: 3,
    status: "Processing",
    due: dateOffset(4),
    total: 10500,
    paid: true,
    assigned: "Dev K.",
    notes: "",
  },
];
let invoices = [
  {
    id: "INV-001",
    customer: "Margaret ",
    order_id: "ORD-001",
    date: dateOffset(0),
    amount: 12000,
    status: "Unpaid",
  },
  {
    id: "INV-002",
    customer: "James Okafor",
    order_id: "ORD-002",
    date: dateOffset(-1),
    amount: 8000,
    status: "Unpaid",
  },
  {
    id: "INV-003",
    customer: "Precious Naira",
    order_id: "ORD-003",
    date: dateOffset(-2),
    amount: 12500,
    status: "Paid",
  },
  {
    id: "INV-004",
    customer: "Toni max",
    order_id: "ORD-004",
    date: dateOffset(0),
    amount: 10000,
    status: "Unpaid",
  },
  {
    id: "INV-005",
    customer: "Sofia ",
    order_id: "ORD-005",
    date: dateOffset(-3),
    amount: 10500,
    status: "Paid",
  },
];
let employees = [
  {
    id: "1",
    name: "Rose ",
    role: "Cleaner",
    phone: "09111111111",
    rate: 800,
    on_duty: true,
    clock_in: "08:00",
    clock_out: null,
    orders_count: 12,
    efficiency: 94,
  },
  {
    id: "2",
    name: "Peter",
    role: "Presser",
    phone: "09122222222",
    rate: 750,
    on_duty: true,
    clock_in: "08:30",
    clock_out: null,
    orders_count: 9,
    efficiency: 91,
  },
  {
    id: "3",
    name: "Tina ",
    role: "Front Desk",
    phone: "09133333333",
    rate: 700,
    on_duty: true,
    clock_in: "09:00",
    clock_out: null,
    orders_count: 0,
    efficiency: 88,
  },
  {
    id: "4",
    name: "Carlos ",
    role: "Supervisor",
    phone: "09144444444",
    rate: 1200,
    on_duty: true,
    clock_in: "07:45",
    clock_out: null,
    orders_count: 5,
    efficiency: 96,
  },
  {
    id: "5",
    name: "MUSA",
    role: "Driver",
    phone: "09155555555",
    rate: 750,
    on_duty: true,
    clock_in: null,
    clock_out: null,
    orders_count: 0,
    efficiency: 89,
  },
  {
    id: "6",
    name: " Benjamin",
    role: "Cleaner",
    phone: "09166666666",
    rate: 800,
    on_duty: false,
    clock_in: null,
    clock_out: null,
    orders_count: 0,
    efficiency: 87,
  },
];
let inventory = [
  {
    id: "1",
    name: "Dry Clean Bags",
    category: "Packaging",
    qty: 320,
    min_level: 100,
    cost: 150,
  },
  {
    id: "2",
    name: "Perchloroethylene",
    category: "Chemicals",
    qty: 48,
    min_level: 20,
    cost: 28500,
  },
  {
    id: "3",
    name: "Hangers (wire)",
    category: "Packaging",
    qty: 1200,
    min_level: 400,
    cost: 80,
  },
  {
    id: "4",
    name: "Garment Tags",
    category: "Tags & Labels",
    qty: 85,
    min_level: 200,
    cost: 50,
  },
  {
    id: "5",
    name: "Stain Remover",
    category: "Chemicals",
    qty: 32,
    min_level: 15,
    cost: 4500,
  },
  {
    id: "6",
    name: "Poly Bags (large)",
    category: "Packaging",
    qty: 410,
    min_level: 150,
    cost: 120,
  },
];
let customers = [
  {
    id: "1",
    name: "Margaret ",
    phone: "80000000001",
    email: "Margaret.com",
    orders_count: 14,
    total_spent: 112000,
    active: true,
  },
  {
    id: "2",
    name: "James Okafor",
    phone: "80000000002",
    email: "james.o@email.com",
    orders_count: 7,
    total_spent: 56000,
    active: true,
  },
  {
    id: "3",
    name: "Precious Naira",
    phone: "90000000003",
    email: "precious.n@email.com",
    orders_count: 22,
    total_spent: 176000,
    active: true,
  },
  {
    id: "4",
    name: "Toni max",
    phone: "90000000004",
    email: "Toni@email.com",
    orders_count: 3,
    total_spent: 24000,
    active: false,
  },
  {
    id: "5",
    name: "Sofia ",
    phone: "90000000005",
    email: "sofia.b@email.com",
    orders_count: 18,
    total_spent: 144000,
    active: true,
  },
  {
    id: "6",
    name: "maxi",
    phone: "90000000006",
    email: "maxi@email.com",
    orders_count: 44,
    total_spent: 352000,
    active: true,
  },
];
let orderCounter = 6,
  invoiceCounter = 6;
let currentReceipt = null;

function formatNaira(value) {
  const n = Math.round(Number(value) || 0);
  return "₦" + n.toLocaleString("en-US");
}

// ── LOADING ──
function showLoad() {
  document.getElementById("loading").classList.add("show");
}
function hideLoad() {
  document.getElementById("loading").classList.remove("show");
}

// ── AUTH ──
async function initAuth() {
  updateDateDisplay();
}

async function doLogin() {
  const name = document.getElementById("li-email").value.trim();
  const pass = document.getElementById("li-pass").value;
  const errEl = document.getElementById("li-err");
  if (name !== "SAM" || pass !== "123456") {
    errEl.textContent = "Incorrect username or password.";
    errEl.style.display = "block";
    return;
  }
  errEl.style.display = "none";
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  document.getElementById("user-av").textContent = initials;
  document.getElementById("dashboard-user").textContent = name.split(/\s+/)[0];
  updateDateDisplay();
  if (DEMO_MODE) renderAll();
  else await loadData();
}

async function doLogout() {
  if (!confirm("Sign out?")) return;
  document.getElementById("app").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("li-pass").value = "";
}

function updateDateDisplay() {
  const now = new Date();
  const dateEl = document.getElementById("current-date");
  const timeEl = document.getElementById("current-time");
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  if (timeEl) {
    timeEl.textContent = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

setInterval(updateDateDisplay, 30000);

async function loadData() {
  if (DEMO_MODE) {
    renderAll();
    return;
  }
  showLoad();
  try {
    const [o, inv, emp, invt, cust] = await Promise.all([
      sb
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),
      sb
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false }),
      sb.from("employees").select("*"),
      sb.from("inventory").select("*"),
      sb.from("customers").select("*"),
    ]);
    orders = o.data || [];
    invoices = inv.data || [];
    employees = emp.data || [];
    inventory = invt.data || [];
    customers = cust.data || [];
    if (orders.length) {
      const ns = orders.map(
        (x) => parseInt(x.id.replace("ORD-", "")) || 0,
      );
      orderCounter = Math.max(...ns) + 1;
    }
    if (invoices.length) {
      const ns = invoices.map(
        (x) => parseInt(x.id.replace("INV-", "")) || 0,
      );
      invoiceCounter = Math.max(...ns) + 1;
    }
    renderAll();
  } catch (e) {
    console.error(e);
  }
  hideLoad();
}

async function save(table, data) {
  if (DEMO_MODE) return { error: null };
  return sb.from(table).insert([data]);
}
async function update(table, data, col, val) {
  if (DEMO_MODE) return { error: null };
  return sb.from(table).update(data).eq(col, val);
}
async function remove(table, col, val) {
  if (DEMO_MODE) return { error: null };
  return sb.from(table).delete().eq(col, val);
}

// ── BADGES ──
function sb2(s) {
  const m = {
    Ready: "b-ready",
    Processing: "b-proc",
    Pending: "b-pend",
  };
  return `<span class="badge ${m[s] || "b-pend"}">${s}</span>`;
}
function pb(p) {
  return p
    ? '<span class="badge b-paid">Paid</span>'
    : '<span class="badge b-unpaid">Unpaid</span>';
}
function ib(s) {
  return s === "Paid"
    ? '<span class="badge b-paid">Paid</span>'
    : '<span class="badge b-unpaid">Unpaid</span>';
}
function stb(it) {
  if (it.qty === 0) return '<span class="badge b-out">Out</span>';
  if (it.qty < it.min_level)
    return '<span class="badge b-low">Low</span>';
  return '<span class="badge b-ok">OK</span>';
}

// ── RENDERS ──
function renderDashboard() {
  document.getElementById("s-orders").textContent = orders.length;
  document.getElementById("s-active").textContent = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing",
  ).length;
  document.getElementById("s-unpaid").textContent = invoices.filter(
    (i) => i.status === "Unpaid",
  ).length;
  document.getElementById("s-duty").textContent = employees.filter(
    (e) => e.on_duty,
  ).length;
  // recent orders
  document.getElementById("db-orders").innerHTML = orders
    .slice(0, 5)
    .map(
      (o) => `
    <tr><td class="oid">${o.id}</td><td><span class="cust">${o.customer}</span></td>
    <td>${o.items} ×${o.qty}</td><td>${sb2(o.status)}</td>
    <td style="color:var(--lime);font-weight:700">${formatNaira(o.total)}</td></tr>`,
    )
    .join("");
  // activity feed
  const acts = [
    {
      icon: "📋",
      col: "lime",
      text: `Order ${orders[0]?.id || "ORD-001"} created for ${orders[0]?.customer || "customer"}`,
      time: "2 min ago",
    },
    {
      icon: "✅",
      col: "cyan",
      text: `${orders[1]?.customer || "James O."}'s order moved to Processing`,
      time: "15 min ago",
    },
    {
      icon: "💳",
      col: "pink",
      text: `Invoice ${invoices[0]?.id || "INV-001"} sent to ${invoices[0]?.customer || "customer"}`,
      time: "32 min ago",
    },
    {
      icon: "👷",
      col: "orange",
      text: `${employees.find((e) => e.on_duty)?.name || "Rosa P."} clocked in`,
      time: "1 hr ago",
    },
    {
      icon: "📦",
      col: "lime",
      text: "Garment Tags stock running low",
      time: "2 hr ago",
    },
  ];
  document.getElementById("activity-feed").innerHTML = acts
    .map(
      (a) => `
    <div class="activity-item">
      <div class="act-dot ${a.col}">${a.icon}</div>
      <div><div class="act-text">${a.text}</div><div class="act-time">${a.time}</div></div>
    </div>`,
    )
    .join("");
}

let orderFilter = "all";
function renderOrders(filter) {
  const list =
    filter && filter !== "all"
      ? orders.filter((o) => o.status === filter)
      : orders;
  document.getElementById("orders-tb").innerHTML = list
    .map(
      (o) => `
    <tr><td class="oid">${o.id}</td>
    <td><span class="cust">${o.customer}</span><br><span style="color:var(--muted);font-size:0.7rem">${o.phone || ""}</span></td>
    <td>${o.items}</td><td style="color:var(--muted)">${o.service}</td>
    <td>${sb2(o.status)}</td>
    <td style="color:var(--muted)">${o.assigned || "—"}</td>
    <td style="font-family:'DM Mono',monospace">${o.due || "—"}</td>
    <td style="color:var(--lime);font-weight:700">${formatNaira(o.total)}</td>
    <td>${pb(o.paid)}</td>
    <td style="display:flex;gap:4px;flex-wrap:wrap">
      <button class="btn btn-ghost btn-sm" onclick="cycleStatus('${o.id}','${o.status}')">↻</button>
      <button class="btn btn-ghost btn-sm" onclick="showReceipt(${JSON.stringify(o).replace(/"/g, "&quot;")})">🧾</button>
      <button class="btn btn-danger btn-sm" onclick="deleteOrder('${o.id}')">✕</button>
    </td></tr>`,
    )
    .join("");
}

function renderBilling() {
  const total = invoices.reduce((a, i) => a + parseFloat(i.amount), 0);
  const paid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((a, i) => a + parseFloat(i.amount), 0);
  const unpaidCount = invoices.filter(
    (i) => i.status === "Unpaid",
  ).length;
  document.getElementById("b-rev").textContent = formatNaira(total);
  document.getElementById("b-out").textContent = unpaidCount;
  document.getElementById("b-coll").textContent = formatNaira(paid);
  document.getElementById("billing-tb").innerHTML = invoices
    .map(
      (i) => `
    <tr><td class="oid">${i.id}</td><td><span class="cust">${i.customer}</span></td>
    <td style="color:var(--cyan)">${i.order_id || "—"}</td>
    <td style="font-family:'DM Mono',monospace">${i.date || "—"}</td>
    <td style="color:var(--lime);font-weight:700">${formatNaira(i.amount)}</td>
    <td>${ib(i.status)}</td>
    <td>${i.status === "Unpaid" ? `<button class="btn btn-lime btn-sm" onclick="markPaid('${i.id}')">Mark Paid</button>` : '<span style="color:var(--muted);font-size:0.75rem">✓</span>'}</td>
    </tr>`,
    )
    .join("");
}

function renderEmployees() {
  const grads = [
    "linear-gradient(135deg,#c8ff00,#00e5ff)",
    "linear-gradient(135deg,#ff2d78,#7c3aff)",
    "linear-gradient(135deg,#ff6b00,#ff2d78)",
    "linear-gradient(135deg,#7c3aff,#00e5ff)",
  ];
  document.getElementById("emp-grid").innerHTML = employees
    .map(
      (e, i) => `
    <div class="emp-card">
      <div class="emp-av" style="background:${grads[i % grads.length]}">${e.name
.split(" ")
.map((n) => n[0])
.join("")}</div>
      <div class="emp-name">${e.name}</div>
      <div class="emp-role">${e.role} · ${formatNaira(e.rate)}/hr</div>
      ${e.on_duty ? '<span class="badge b-on">On Duty</span>' : '<span class="badge b-off">Off</span>'}
      <div class="emp-row"><span>Orders</span><strong>${e.orders_count || 0}</strong></div>
      <div class="emp-row"><span>Efficiency</span><strong style="color:var(--lime)">${e.efficiency || 90}%</strong></div>
    </div>`,
    )
    .join("");
  document.getElementById("shift-tb").innerHTML = employees
    .map(
      (e) => `
    <tr><td><span class="cust">${e.name}</span></td>
    <td style="color:var(--muted)">${e.role}</td>
    <td style="color:var(--lime);font-family:'DM Mono',monospace">${e.clock_in || "—"}</td>
    <td style="color:var(--muted);font-family:'DM Mono',monospace">${e.clock_out || "—"}</td>
    <td style="font-weight:700">${e.orders_count || 0}</td>
    <td>${e.on_duty ? '<span class="badge b-on">On Duty</span>' : '<span class="badge b-off">Off</span>'}</td></tr>`,
    )
    .join("");
  // update dropdowns
  const as = document.getElementById("o-assign");
  if (as)
    as.innerHTML =
      '<option value="">Unassigned</option>' +
      employees
        .filter((e) => e.on_duty)
        .map((e) => `<option>${e.name}</option>`)
        .join("");
  const cs = document.getElementById("cl-emp");
  if (cs)
    cs.innerHTML = employees
      .map(
        (e) =>
          `<option value="${e.id}">${e.name} (${e.on_duty ? "On Duty" : "Off"})</option>`,
      )
      .join("");
}

function renderInventory() {
  document.getElementById("inv-tb").innerHTML = inventory
    .map((it, i) => {
      const pct = Math.min(
        100,
        Math.round(
          (it.qty / Math.max(it.qty, it.min_level * 1.5 || 1)) * 100,
        ),
      );
      const col =
        it.qty < it.min_level
          ? "var(--pink)"
          : it.qty < it.min_level * 1.5
            ? "var(--orange)"
            : "var(--lime)";
      return `<tr><td><span class="cust">${it.name}</span></td>
    <td style="color:var(--muted)">${it.category}</td>
    <td style="font-weight:700;color:${it.qty < it.min_level ? "var(--pink)" : "var(--white)"}">${it.qty}</td>
    <td style="color:var(--muted)">${it.min_level}</td>
    <td style="font-family:'DM Mono',monospace">${formatNaira(it.cost)}</td>
    <td><div class="inv-bar-wrap"><div class="inv-bar" style="width:${pct}%;background:${col}"></div></div></td>
    <td>${stb(it)}</td>
    <td style="display:flex;gap:4px">
      <button class="btn btn-ghost btn-sm" onclick="restockItem('${it.id}',${it.qty})">+Stock</button>
      <button class="btn btn-danger btn-sm" onclick="deleteItem('${it.id}')">✕</button>
    </td></tr>`;
    })
    .join("");
}

function renderCustomers() {
  document.getElementById("cust-tb").innerHTML = customers
    .map(
      (c) => `
    <tr><td><span class="cust">${c.name}</span></td>
    <td style="font-family:'DM Mono',monospace">${c.phone || "—"}</td>
    <td style="color:var(--muted)">${c.email || "—"}</td>
    <td style="font-weight:700">${c.orders_count || 0}</td>
    <td style="color:var(--lime);font-weight:700">${formatNaira(c.total_spent || 0)}</td>
    <td>${c.active ? '<span class="badge b-on">Active</span>' : '<span class="badge b-unpaid">Inactive</span>'}</td></tr>`,
    )
    .join("");
}

function renderReports() {
  document.getElementById("rp-rev").textContent = formatNaira(
    orders.reduce((a, o) => a + parseFloat(o.total), 0),
  );
  document.getElementById("rp-done").textContent = orders.filter(
    (o) => o.status === "Ready",
  ).length;
  document.getElementById("rp-cust").textContent = customers.length;
  document.getElementById("rp-staff").textContent = employees.length;
  const svcRev = {};
  orders.forEach((o) => {
    svcRev[o.service] = (svcRev[o.service] || 0) + parseFloat(o.total);
  });
  const total = Object.values(svcRev).reduce((a, b) => a + b, 0) || 1;
  const cols = {
    "Dry Cleaning": "var(--lime)",
    Laundry: "var(--orange)",
    Alterations: "var(--cyan)",
    Pressing: "var(--pink)",
  };
  document.getElementById("rev-chart").innerHTML = Object.entries(
    svcRev,
  )
    .map(
      ([s, r]) => `
    <div class="rev-bar-wrap">
      <div class="rev-bar-top"><span>${s}</span><span style="color:${cols[s] || "var(--lime)"}">${formatNaira(r)} · ${Math.round((r / total) * 100)}%</span></div>
      <div class="rev-bar-bg"><div class="rev-bar-fill" style="width:${Math.round((r / total) * 100)}%;background:${cols[s] || "var(--lime)"}"></div></div>
    </div>`,
    )
    .join("");
  const statuses = ["Pending", "Processing", "Ready"];
  const sc = {};
  statuses.forEach(
    (s) => (sc[s] = orders.filter((o) => o.status === s).length),
  );
  const scols = {
    Pending: "var(--cyan)",
    Processing: "var(--orange)",
    Ready: "var(--lime)",
  };
  const stotal = orders.length || 1;
  document.getElementById("status-chart").innerHTML = statuses
    .map(
      (s) => `
    <div class="rev-bar-wrap">
      <div class="rev-bar-top"><span>${s}</span><span style="color:${scols[s]}">${sc[s]} orders · ${Math.round((sc[s] / stotal) * 100)}%</span></div>
      <div class="rev-bar-bg"><div class="rev-bar-fill" style="width:${Math.round((sc[s] / stotal) * 100)}%;background:${scols[s]}"></div></div>
    </div>`,
    )
    .join("");
}

function renderAll() {
  renderDashboard();
  renderOrders(orderFilter);
  renderBilling();
  renderEmployees();
  renderInventory();
  renderCustomers();
  renderReports();
}

// ── PAGE NAV ──
function showPage(name, el) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + name).classList.add("active");
  if (el) {
    document
      .querySelectorAll(".nav-link")
      .forEach((n) => n.classList.remove("active"));
    el.classList.add("active");
  }
}

// ── MODALS ──
function openModal(id) {
  document.getElementById("modal-" + id).classList.add("open");
}
function closeModal(id) {
  document.getElementById("modal-" + id).classList.remove("open");
}
document.querySelectorAll(".overlay").forEach((m) =>
  m.addEventListener("click", (e) => {
    if (e.target === m) m.classList.remove("open");
  }),
);

// ── CALC ──
function calcTotal() {
  const sel = document.getElementById("o-item");
  const opt = sel.options[sel.selectedIndex];
  const price = parseFloat(opt?.dataset?.price || 0);
  const qty = parseInt(document.getElementById("o-qty").value) || 1;
  document.getElementById("r-item").textContent = opt?.value || "—";
  document.getElementById("r-svc").textContent =
    document.getElementById("o-service").value || "—";
  document.getElementById("r-calc").textContent =
    `${qty} × ${formatNaira(price)}`;
  document.getElementById("r-total").textContent = formatNaira(
    price * qty,
  );
}

// ── SUBMITS ──
async function submitOrder() {
  const name = document.getElementById("o-name").value.trim();
  const phone = document.getElementById("o-phone").value.trim();
  const service = document.getElementById("o-service").value;
  const isel = document.getElementById("o-item");
  const item = isel.options[isel.selectedIndex]?.value;
  const price = parseFloat(
    isel.options[isel.selectedIndex]?.dataset?.price || 0,
  );
  const qty = parseInt(document.getElementById("o-qty").value) || 1;
  const due = document.getElementById("o-due").value;
  const assigned = document.getElementById("o-assign").value;
  const notes = document.getElementById("o-notes").value;
  if (!name || !service || !item)
    return alert("Fill all required fields.");
  const id = "ORD-" + String(orderCounter).padStart(3, "0");
  const btn = document.getElementById("btn-order");
  btn.disabled = true;
  btn.textContent = "Saving...";
  const newOrder = {
    id,
    customer: name,
    phone,
    items: item,
    service,
    qty,
    status: "Pending",
    due: due || null,
    total: price * qty,
    paid: false,
    assigned: assigned || null,
    notes: notes || null,
  };
  const { error } = await save("orders", newOrder);
  btn.disabled = false;
  btn.textContent = "Create Order";
  if (error) return alert("Error: " + error.message);
  if (DEMO_MODE) orders.unshift(newOrder);
  orderCounter++;
  closeModal("newOrder");
  ["o-name", "o-phone", "o-notes"].forEach(
    (f) => (document.getElementById(f).value = ""),
  );
  ["o-service", "o-item", "o-assign"].forEach(
    (f) => (document.getElementById(f).value = ""),
  );
  document.getElementById("o-qty").value = 1;
  document.getElementById("o-due").value = "";
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function submitInvoice() {
  const customer = document.getElementById("inv-cust").value.trim();
  const order_id = document.getElementById("inv-ord").value.trim();
  const amount =
    parseFloat(document.getElementById("inv-amt").value) || 0;
  if (!customer) return alert("Enter customer name.");
  const id = "INV-" + String(invoiceCounter).padStart(3, "0");
  const newInv = {
    id,
    customer,
    order_id: order_id || null,
    date: new Date().toISOString().split("T")[0],
    amount,
    status: "Unpaid",
  };
  const { error } = await save("invoices", newInv);
  if (error) return alert("Error: " + error.message);
  if (DEMO_MODE) invoices.unshift(newInv);
  invoiceCounter++;
  closeModal("newInvoice");
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function submitEmployee() {
  const name = document.getElementById("em-name").value.trim();
  const role = document.getElementById("em-role").value;
  const phone = document.getElementById("em-phone").value.trim();
  const rate =
    parseFloat(document.getElementById("em-rate").value) || 800;
  if (!name) return alert("Enter name.");
  const newEmp = {
    id: String(Date.now()),
    name,
    role,
    phone,
    rate,
    on_duty: false,
    clock_in: null,
    clock_out: null,
    orders_count: 0,
    efficiency: 90,
  };
  const { error } = await save("employees", newEmp);
  if (error) return alert("Error: " + error.message);
  if (DEMO_MODE) employees.push(newEmp);
  closeModal("newEmployee");
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function submitClock() {
  const empId = document.getElementById("cl-emp").value;
  const action = document.getElementById("cl-act").value;
  const now = new Date();
  const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const upd =
    action === "in"
      ? { on_duty: true, clock_in: t, clock_out: null }
      : { on_duty: false, clock_out: t };
  const { error } = await update("employees", upd, "id", empId);
  if (error) return alert("Error: " + error.message);
  if (DEMO_MODE) {
    const e = employees.find((x) => x.id === empId);
    if (e) Object.assign(e, upd);
  }
  closeModal("clockIn");
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function submitItem() {
  const name = document.getElementById("it-name").value.trim();
  const category = document.getElementById("it-cat").value;
  const qty = parseInt(document.getElementById("it-qty").value) || 0;
  const min_level =
    parseInt(document.getElementById("it-min").value) || 0;
  const cost =
    parseFloat(document.getElementById("it-cost").value) || 0;
  if (!name) return alert("Enter item name.");
  const newItem = {
    id: String(Date.now()),
    name,
    category,
    qty,
    min_level,
    cost,
  };
  const { error } = await save("inventory", newItem);
  if (error) return alert("Error: " + error.message);
  if (DEMO_MODE) inventory.push(newItem);
  closeModal("newItem");
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function submitCustomer() {
  const name = document.getElementById("cu-name").value.trim();
  const phone = document.getElementById("cu-phone").value.trim();
  const email = document.getElementById("cu-email").value.trim();
  if (!name) return alert("Enter name.");
  const newC = {
    id: String(Date.now()),
    name,
    phone,
    email,
    orders_count: 0,
    total_spent: 0,
    active: true,
  };
  const { error } = await save("customers", newC);
  if (error) return alert("Error: " + error.message);
  if (DEMO_MODE) customers.push(newC);
  closeModal("newCustomer");
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

// ── ACTIONS ──
function filterOrders(status, el) {
  orderFilter = status;
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  renderOrders(status === "all" ? null : status);
}

async function cycleStatus(id, current) {
  const cycle = {
    Pending: "Processing",
    Processing: "Ready",
    Ready: "Pending",
  };
  const next = cycle[current] || "Pending";
  await update("orders", { status: next }, "id", id);
  if (DEMO_MODE) {
    const o = orders.find((x) => x.id === id);
    if (o) o.status = next;
  }
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function deleteOrder(id) {
  if (!confirm("Delete this order?")) return;
  await remove("orders", "id", id);
  if (DEMO_MODE) orders = orders.filter((o) => o.id !== id);
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function markPaid(id) {
  await update("invoices", { status: "Paid" }, "id", id);
  if (DEMO_MODE) {
    const i = invoices.find((x) => x.id === id);
    if (i) i.status = "Paid";
  }
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function restockItem(id, current) {
  const n = prompt("Add how many units?", "50");
  if (!n) return;
  const newQty = current + parseInt(n);
  await update("inventory", { qty: newQty }, "id", id);
  if (DEMO_MODE) {
    const it = inventory.find((x) => x.id === id);
    if (it) it.qty = newQty;
  }
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

async function deleteItem(id) {
  if (!confirm("Remove this item?")) return;
  await remove("inventory", "id", id);
  if (DEMO_MODE) inventory = inventory.filter((x) => x.id !== id);
  if (!DEMO_MODE) await loadData();
  else renderAll();
}

// ── RECEIPTS ──
function buildReceiptHTML(o) {
  return `<div style="text-align:center;margin-bottom:1.2rem">
    <div style="font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:0.12em;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent">sam</div>
    <div style="font-size:0.65rem;color:var(--muted);letter-spacing:0.14em;text-transform:uppercase">Receipt · ${new Date().toLocaleDateString()}</div>
  </div>
  <div style="border-top:1px dashed rgba(255,255,255,0.1);border-bottom:1px dashed rgba(255,255,255,0.1);padding:0.8rem 0;margin-bottom:0.8rem">
    <div class="rr"><span>Order</span><span style="color:var(--lime)">${o.id}</span></div>
    <div class="rr"><span>Customer</span><span>${o.customer}</span></div>
    <div class="rr"><span>Phone</span><span>${o.phone || "—"}</span></div>
  </div>
  <div class="rr"><span>Item</span><span>${o.items} ×${o.qty}</span></div>
  <div class="rr"><span>Service</span><span>${o.service}</span></div>
  <div class="rr"><span>Due</span><span>${o.due || "—"}</span></div>
  <div class="rr"><span>Status</span><span>${o.status}</span></div>
  ${o.notes ? `<div class="rr"><span>Notes</span><span>${o.notes}</span></div>` : ""}
  <div class="rr rtot"><span>TOTAL</span><span>${formatNaira(o.total)}</span></div>
  <div class="rr"><span>Payment</span><span style="color:${o.paid ? "var(--lime)" : "var(--pink)"}">${o.paid ? "✓ Paid" : "⚠ Unpaid"}</span></div>
  <div style="text-align:center;margin-top:1.2rem;font-size:0.65rem;color:var(--muted)">Thank you for choosing Sam-D · (090) 000-0000</div>`;
}

function showReceipt(o) {
  currentReceipt = o;
  document.getElementById("receipt-html").innerHTML =
    buildReceiptHTML(o);
  buildPrint(o);
  openModal("receipt");
}

function buildPrint(o) {
  document.getElementById("print-area").innerHTML = `
    <h2>sam</h2><div class="pr-sub">Receipt · ${new Date().toLocaleDateString()}</div>
    <div class="pr-row"><span>Order</span><span>${o.id}</span></div>
    <div class="pr-row"><span>Customer</span><span>${o.customer}</span></div>
    <div class="pr-row"><span>Item</span><span>${o.items} ×${o.qty}</span></div>
    <div class="pr-row"><span>Service</span><span>${o.service}</span></div>
    <div class="pr-row"><span>Due</span><span>${o.due || "—"}</span></div>
    <div class="pr-total"><span>TOTAL</span><span>${formatNaira(o.total)}</span></div>
    <div class="pr-row"><span>Payment</span><span>${o.paid ? "Paid" : "Unpaid"}</span></div>
    <div class="pr-foot">Thank you for choosing Sam-D! · (090) 000-0000</div>`;
}

function exportTxt() {
  if (!currentReceipt) return;
  const o = currentReceipt;
  const txt = `sam Receipt\n${"═".repeat(28)}\nOrder: ${o.id}\nCustomer: ${o.customer}\nItem: ${o.items} x${o.qty}\nService: ${o.service}\nDue: ${o.due || "—"}\nStatus: ${o.status}\n${"─".repeat(28)}\nTOTAL: ${formatNaira(o.total)}\nPayment: ${o.paid ? "Paid" : "Unpaid"}\n${"═".repeat(28)}\nThank you for choosing Sam-D!`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
  a.download = `Receipt-${o.id}.txt`;
  a.click();
}

// ── PORTAL ──
function portalSearch() {
  const q = document.getElementById("portal-q").value.trim();
  const res = document.getElementById("portal-result");
  const err = document.getElementById("portal-err");
  res.style.display = "none";
  err.style.display = "none";
  const o = orders.find(
    (x) => x.id === q.toUpperCase() || x.phone === q,
  );
  if (!o) {
    err.style.display = "block";
    return;
  }
  document.getElementById("pr-id").textContent = o.id;
  document.getElementById("pr-cust").textContent = o.customer;
  document.getElementById("pr-item").textContent =
    o.items + " ×" + o.qty;
  document.getElementById("pr-svc").textContent = o.service;
  document.getElementById("pr-due").textContent = o.due || "—";
  document.getElementById("pr-total").textContent = formatNaira(o.total);
  document.getElementById("pr-paid").textContent = o.paid
    ? "✓ Paid"
    : "⚠ Unpaid";
  const steps = ["Pending", "Processing", "Ready", "Collected"];
  const ci = steps.indexOf(o.status);
  document.getElementById("pr-steps").innerHTML = steps
    .map(
      (s, i) =>
        `<div class="ps ${i < ci ? "done" : i === ci ? "current" : ""}">${s}</div>`,
    )
    .join("");
  res.style.display = "block";
  currentReceipt = o;
  buildPrint(o);
}

// ── CSV ──
function exportCSV() {
  const rows = [
    [
      "Order ID",
      "Customer",
      "Items",
      "Service",
      "Qty",
      "Status",
      "Due",
      "Total",
      "Paid",
    ],
    ...orders.map((o) => [
      o.id,
      o.customer,
      o.items,
      o.service,
      o.qty,
      o.status,
      o.due,
      o.total,
      o.paid ? "Yes" : "No",
    ]),
  ];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([rows.map((r) => r.join(",")).join("\n")], {
      type: "text/csv",
    }),
  );
  a.download = "Sam-D-orders.csv";
  a.click();
}

// ── INIT ──
initAuth();
function printReceipt() {
  const receiptContent =
    document.getElementById("receipt-html").innerHTML;
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
<title>Receipt</title>
<link rel="stylesheet" href="css/print.css" />
      </head>
      <body>
${receiptContent}
<script>window.print(); window.close();<\/script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
