(function () {
  const Data = window.BJData;
  const Store = window.BJStore;

  const state = {
    route: "dashboard",
    filter: "all",
    priceNet: "MTN",
    menus: { utilities: false, fund: false },
    navOpen: false,
    chatOpen: false,
    mode: "login",
    busy: false,
    messages: [
      {
        from: "desk",
        text: "Hi, this is Biggest Jay support. Ask about funding, data, airtime, or a purchase. This desk is a demo, so no real money moves.",
      },
    ],
  };

  const icons = {
    home: '<path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"/>',
    data: '<path d="M5 8c2.5 2 11.5 2 14 0"/><path d="M5 12c2.5 2 11.5 2 14 0"/><path d="M5 16c2.5 2 11.5 2 14 0"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    print: '<path d="M7 8V4h10v4"/><rect x="5" y="8" width="14" height="8" rx="1"/><path d="M7 14h10v6H7z"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M8 14a4 4 0 1 1 8 0c0 1.5-.8 2.4-1.5 3.2-.4.4-.5.8-.5 1.3h-4c0-.5-.1-.9-.5-1.3C8.8 16.4 8 15.5 8 14z"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
    people: '<circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2"/><path d="M4 19c.6-2.4 2.4-3.5 5-3.5s4.4 1.1 5 3.5"/><path d="M14 15.6c1.4-.4 2.8-.2 4 .8.8.7 1.3 1.6 1.5 2.6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
    code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12h4v3h-4a1.5 1.5 0 0 1 0-3z"/>',
    list: '<path d="M8 7h12M8 12h12M8 17h12"/><path d="M4 7h.01M4 12h.01M4 17h.01"/>',
    tag: '<path d="M3 12V5h7l11 11-7 7z"/><circle cx="8" cy="8" r="1"/>',
    user: '<circle cx="12" cy="8" r="3"/><path d="M5 19c1.2-3 3.2-4.5 7-4.5s5.8 1.5 7 4.5"/>',
    out: '<path d="M10 7V5H5v14h5v-2"/><path d="M10 12h9"/><path d="m15 8 4 4-4 4"/>',
    wifi: '<path d="M5 10a10 10 0 0 1 14 0"/><path d="M8 13a6 6 0 0 1 8 0"/><circle cx="12" cy="17" r="1"/>',
    cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="m8 20 4-2 4 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };

  function svg(name) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ""}</svg>`;
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function naira(value) {
    const amount = Math.round(Number(value) || 0);
    return "₦" + amount.toLocaleString("en-NG");
  }

  function stamp(iso) {
    return new Date(iso).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function openModal(html) {
    const modal = document.getElementById("modal");
    modal.innerHTML = `<div class="modal-card" role="dialog" aria-modal="true">${html}</div>`;
    modal.hidden = false;
    document.body.classList.add("lock");
    modal.querySelector("button, a")?.focus();
  }

  function closeModal() {
    document.getElementById("modal").hidden = true;
    document.getElementById("modal").innerHTML = "";
    document.body.classList.remove("lock");
  }

  function normalizePhone(value) {
    let digits = String(value || "").replace(/\D/g, "");
    if (digits.startsWith("234")) digits = "0" + digits.slice(3);
    if (digits.length === 10) digits = "0" + digits;
    return digits;
  }

  function phoneError(network, raw, bypass) {
    const phone = normalizePhone(raw);
    if (!/^0\d{10}$/.test(phone)) return "Enter an 11-digit mobile number.";
    if (bypass) return "";
    const match = Data.networks.find((item) => item.id === network);
    const prefix = phone.slice(0, 4);
    if (match && !match.prefixes.includes(prefix)) {
      return `This number does not look like ${network}. Tick bypass to sell anyway.`;
    }
    return "";
  }

  function priceOf(plan) {
    const db = Store.get();
    return plan.prices[db.user.package] || plan.prices.smart;
  }

  function packageName(id) {
    return Data.packageById(id).name;
  }

  function go(route) {
    if (location.hash === "#/" + route) {
      state.route = route;
      paint();
      return;
    }
    location.hash = "#/" + route;
  }

  function setError(message) {
    const el = document.getElementById("form-error");
    if (!el) return;
    el.hidden = !message;
    el.textContent = message || "";
  }

  function receipt(tx, extra) {
    openModal(`
      <p class="muted">Reference ${esc(tx.id)}</p>
      <h2>Payment successful</h2>
      <p><strong>${esc(tx.title)}</strong><br />${esc(tx.detail)}</p>
      <p>Amount <strong>${naira(tx.amount)}</strong></p>
      <p>Wallet balance <strong>${naira(Store.get().wallet.balance)}</strong></p>
      ${extra || ""}
      <div class="modal-actions">
        <button class="btn btn-navy" type="button" data-act="close-modal">Done</button>
      </div>
    `);
  }

  function pinCode() {
    const chunk = () => String(Math.floor(1000 + Math.random() * 9000));
    return `${chunk()}-${chunk()}-${chunk()}`;
  }

  function tokenCode() {
    let out = "";
    for (let i = 0; i < 20; i += 1) out += Math.floor(Math.random() * 10);
    return out.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }

  const nav = [
    { id: "dashboard", href: "dashboard", label: "Dashboard", icon: "home" },
    { id: "data", href: "data", label: "Buy Data", icon: "data" },
    { id: "airtime", href: "airtime", label: "Buy Airtime", icon: "phone" },
    { id: "cards", href: "cards", label: "Data card Printing", icon: "print" },
    {
      id: "utilities",
      label: "Utilities Payment",
      icon: "bulb",
      children: [
        { id: "electricity", href: "electricity", label: "Electricity Bills" },
        { id: "cable", href: "cable", label: "Cable Subscription" },
        { id: "exam", href: "exam", label: "Result checker" },
      ],
    },
    {
      id: "fund",
      label: "Fund Wallet",
      icon: "wallet",
      children: [
        { id: "fund", href: "fund", label: "Enter amount" },
        { id: "virtual", href: "virtual", label: "Virtual account" },
      ],
    },
    { id: "history", href: "history", label: "Transactions", icon: "list" },
    { id: "wallet", href: "wallet", label: "Wallet Summary", icon: "card" },
    { id: "referrals", href: "referrals", label: "My Referrals", icon: "people" },
    { id: "pricing", href: "pricing", label: "Pricing", icon: "tag" },
    { id: "account", href: "account", label: "Account", icon: "user" },
    { id: "settings", href: "settings", label: "Settings", icon: "gear" },
    { id: "api", href: "api", label: "Developer's API", icon: "code" },
  ];

  function renderSidebar() {
    const db = Store.get();
    const links = nav
      .map((item) => {
        if (item.children) {
          const open = state.menus[item.id] || item.children.some((child) => child.id === state.route);
          return `
            <button class="nav-toggle" type="button" data-act="toggle-menu" data-menu="${item.id}" aria-expanded="${open ? "true" : "false"}">
              ${svg(item.icon)} ${esc(item.label)}
              <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
            </button>
            ${open ? `<div class="sub">${item.children.map((child) => `<a href="#/${child.href}" class="${state.route === child.id ? "active" : ""}">${esc(child.label)}</a>`).join("")}</div>` : ""}
          `;
        }
        return `<a href="#/${item.href}" class="${state.route === item.id ? "active" : ""}">${svg(item.icon)} ${esc(item.label)}</a>`;
      })
      .join("");
    document.getElementById("sidebar").innerHTML = `
      <div class="brand-row">
        <span class="mark">BJ</span>
        <span><strong>Biggest Jay</strong><small>Retail wallet</small></span>
      </div>
      <div class="user-card">
        <div class="avatar" aria-hidden="true">${esc(db.user.username.slice(0, 1).toUpperCase())}</div>
        <div>
          <strong>${esc(db.user.username)}</strong>
          <span>balance: ${naira(db.wallet.balance)}</span>
        </div>
      </div>
      <nav class="nav" aria-label="Desk">${links}
        <button class="nav-toggle" type="button" data-act="logout">${svg("out")} Logout</button>
      </nav>
      <div class="side-foot">Version 1.0 · Demo</div>
    `;
    document.getElementById("sidebar").classList.toggle("open", state.navOpen);
    document.querySelector(".scrim").hidden = !state.navOpen;
  }

  function renderTop() {
    document.getElementById("topbar").innerHTML = `
      <button class="icon-btn" type="button" data-act="open-nav" aria-label="Open menu">${svg("menu")}</button>
      <h1>Welcome</h1>
      <div class="top-actions">
        <button class="ghost-btn" type="button" data-act="toggle-chat">Support</button>
        <button class="logout-btn" type="button" data-act="logout">Logout</button>
      </div>
    `;
  }

  function page(title) {
    document.title = title + " · Biggest Jay";
  }

  function field(id, label, control, hint) {
    return `<label for="${id}">${label}${control}</label>${hint ? `<p class="hint">${hint}</p>` : ""}`;
  }

  function errorBox() {
    return `<p class="form-error" id="form-error" hidden></p>`;
  }

  function options(list, selected, labeler) {
    return list
      .map((item) => {
        const value = typeof item === "string" ? item : item.id;
        const label = labeler ? labeler(item) : item.name || item.label || item;
        return `<option value="${esc(value)}" ${value === selected ? "selected" : ""}>${esc(label)}</option>`;
      })
      .join("");
  }

  function viewDashboard() {
    page("Dashboard");
    const db = Store.get();
    const cards = Data.services
      .map(
        (item) => `
        <a class="service" href="#/${item.href}">
          <span class="service-icon tone-${item.tone}">${svg(item.icon)}</span>
          <span>${esc(item.label)}</span>
        </a>`
      )
      .join("");
    return `
      <div class="stack">
        ${db.wallet.balance < 500 ? `<p class="low">Wallet is low. <a href="#/fund">Fund it</a> before the next sale.</p>` : ""}
        <section class="panel package-block">
          <p class="who">${esc(db.user.username)}</p>
          <h2>Package : ${esc(packageName(db.user.package))}</h2>
          <a class="btn btn-navy" href="#/virtual">Generate virtual account to fund your wallet</a>
        </section>
        <section class="promo">
          <p><strong>New.</strong> Resell data, airtime, recharge cards, and bills from this Biggest Jay desk. Your package sets the price you pay.</p>
          <a class="btn btn-white" href="#/pricing">See prices</a>
        </section>
        <section class="services">${cards}</section>
        <section class="panel">
          <h2>Transaction statistics</h2>
          <dl class="stats">
            <div class="stat"><dt>WALLET BALANCE</dt><dd>${naira(db.wallet.balance)}</dd></div>
            <div class="stat"><dt>TOTAL FUNDING</dt><dd>${naira(db.wallet.totalFunding)}</dd></div>
            <div class="stat"><dt>TOTAL SPENT</dt><dd>${naira(db.wallet.totalSpent)}</dd></div>
          </dl>
        </section>
        <section class="vaccount">
          <h2>JayPay</h2>
          <p>Account Number</p>
          <p class="acct-no">${esc(db.account.number)} <button class="copy" type="button" data-act="copy" data-copy="${esc(db.account.number)}">Copy</button></p>
          <p>Account Name: ${esc(db.account.name)}</p>
          <p>Bank Name: ${esc(db.account.bank)}</p>
          <div class="charge-tag"><strong>${naira(db.account.charge)}</strong><br />CHARGE</div>
        </section>
      </div>
    `;
  }

  function selectedPlan() {
    const select = document.getElementById("data-plan");
    return select ? Data.planById(select.value) : null;
  }

  function viewData() {
    page("Buy Data");
    const db = Store.get();
    const network = "MTN";
    const type = "SME";
    const list = Data.plansFor(network, type);
    const current = list.find((item) => item.size === "1.0GB") || list[0];
    return `
      <div class="layout">
        <form class="panel form" id="data-form">
          <h2>Buy Data</h2>
          ${field("data-network", "Network*", `<select id="data-network" name="network">${options(Data.networks, network, (item) => item.id)}</select>`)}
          ${field("data-type", "Data type", `<select id="data-type" name="type">${options(Data.types, type)}</select>`, "SME, Gifting, or Corporate Gifting.")}
          ${field("data-phone", "Mobile number*", `<input id="data-phone" name="phone" inputmode="numeric" autocomplete="tel" placeholder="0803..." value="${esc(db.user.phone || "")}" />`)}
          ${field("data-plan", "Plan*", `<select id="data-plan" name="plan">${options(list, current.id, (item) => `${item.size} ${item.type} = ${naira(priceOf(item))} ${item.validity}`)}</select>`)}
          ${field("data-amount", "Amount", `<input id="data-amount" readonly value="${naira(priceOf(current))}" />`, `${esc(packageName(db.user.package))} price. Wallet ${naira(db.wallet.balance)}.`)}
          <label class="check"><input id="data-bypass" type="checkbox" /> Bypass number validator</label>
          ${errorBox()}
          <button class="btn btn-navy wide" type="submit">Buy Now</button>
        </form>
        <aside class="panel">
          <h2>Codes for data balance</h2>
          <div class="codes" id="code-list">${codeList(network)}</div>
          <p class="hint">Dial these on the customer's phone. Biggest Jay does not place the call.</p>
        </aside>
      </div>
    `;
  }

  function codeList(network) {
    const tone = network === "9mobile" ? "mobile" : network.toLowerCase();
    return (Data.codes[network] || [])
      .map((row) => `<p class="code ${tone}"><span>${esc(row[0])}</span><strong>${esc(row[1])}</strong></p>`)
      .join("");
  }

  function refreshPlans() {
    const network = document.getElementById("data-network").value;
    const type = document.getElementById("data-type").value;
    const select = document.getElementById("data-plan");
    const list = Data.plansFor(network, type);
    const current = list.find((item) => item.size === "1.0GB") || list[0];
    select.innerHTML = options(list, current?.id, (item) => `${item.size} ${item.type} = ${naira(priceOf(item))} ${item.validity}`);
    const amount = document.getElementById("data-amount");
    if (current) amount.value = naira(priceOf(current));
    document.getElementById("code-list").innerHTML = codeList(network);
  }

  function viewAirtime() {
    page("Buy Airtime");
    const db = Store.get();
    const chips = [100, 200, 500, 1000, 2000, 5000]
      .map((amount) => `<button class="chip" type="button" data-act="airtime-chip" data-amount="${amount}">${naira(amount)}</button>`)
      .join("");
    return `
      <form class="panel form" id="airtime-form">
        <h2>Airtime TopUp</h2>
        ${field("air-network", "Network*", `<select id="air-network">${options(Data.networks, "MTN", (item) => item.id)}</select>`)}
        ${field("air-phone", "Mobile number*", `<input id="air-phone" inputmode="numeric" value="${esc(db.user.phone || "")}" />`)}
        <div class="chips">${chips}</div>
        ${field("air-amount", "Amount*", `<input id="air-amount" inputmode="numeric" value="100" />`, `Wallet ${naira(db.wallet.balance)}. Minimum ₦50.`)}
        <label class="check"><input id="air-bypass" type="checkbox" /> Bypass number validator</label>
        ${errorBox()}
        <button class="btn btn-navy wide" type="submit">Buy Now</button>
      </form>
    `;
  }

  function viewCards() {
    page("Data card printing");
    const db = Store.get();
    const list = Data.plansFor("MTN", "SME");
    const batches = db.batches
      .slice(0, 3)
      .map(
        (batch) => `
        <section class="print-area">
          <h3>${esc(batch.title)} · ${esc(stamp(batch.at))}</h3>
          <div class="pins">
            ${batch.pins
              .map(
                (pin) => `
              <article class="pin-card">
                <p>${esc(batch.title)}</p>
                <strong>${esc(pin.pin)}</strong>
                <span>Serial ${esc(pin.serial)}</span>
              </article>`
              )
              .join("")}
          </div>
        </section>`
      )
      .join("");
    return `
      <div class="stack">
        <form class="panel form" id="card-form">
          <h2>Data card printing</h2>
          <div class="row-2">
            ${field("card-network", "Network*", `<select id="card-network">${options(Data.networks, "MTN", (item) => item.id)}</select>`)}
            ${field("card-type", "Data type", `<select id="card-type">${options(Data.types, "SME")}</select>`)}
          </div>
          ${field("card-plan", "Plan*", `<select id="card-plan">${options(list, list[0].id, (item) => `${item.size} = ${naira(priceOf(item))} ${item.validity}`)}</select>`)}
          ${field("card-qty", "Quantity*", `<input id="card-qty" type="number" min="1" max="20" value="1" />`)}
          <p id="card-total">Total ${naira(priceOf(list[0]))}. Wallet ${naira(db.wallet.balance)}.</p>
          ${errorBox()}
          <button class="btn btn-navy wide" type="submit">Print pins</button>
        </form>
        ${batches ? `<section class="panel stack"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><h2>Latest pins</h2><button class="btn btn-line" type="button" data-act="print-pins">Print</button></div>${batches}</section>` : ""}
      </div>
    `;
  }

  function refreshCardPlans() {
    const network = document.getElementById("card-network").value;
    const type = document.getElementById("card-type").value;
    const list = Data.plansFor(network, type);
    document.getElementById("card-plan").innerHTML = options(
      list,
      list[0]?.id,
      (item) => `${item.size} = ${naira(priceOf(item))} ${item.validity}`
    );
    updateCardTotal();
  }

  function updateCardTotal() {
    const plan = Data.planById(document.getElementById("card-plan").value);
    const qty = Math.max(1, Number(document.getElementById("card-qty").value) || 1);
    const note = document.getElementById("card-total");
    if (!plan || !note) return;
    note.textContent = `Total ${naira(priceOf(plan) * qty)}. Wallet ${naira(Store.get().wallet.balance)}.`;
  }

  function viewElectricity() {
    page("Electricity");
    return `
      <form class="panel form" id="power-form">
        <h2>Electricity bills</h2>
        ${field("power-disco", "Disco*", `<select id="power-disco">${options(Data.discos, "AEDC")}</select>`)}
        ${field("power-type", "Meter type*", `<select id="power-type"><option value="Prepaid">Prepaid</option><option value="Postpaid">Postpaid</option></select>`)}
        ${field("power-meter", "Meter number*", `<input id="power-meter" inputmode="numeric" placeholder="10 to 13 digits" />`)}
        ${field("power-amount", "Amount*", `<input id="power-amount" inputmode="numeric" placeholder="1000" />`, `Service fee ${naira(Data.billFee)} is added. Minimum ₦500 of units.`)}
        <p id="power-total" class="hint"></p>
        ${errorBox()}
        <button class="btn btn-navy wide" type="submit">Pay bill</button>
      </form>
    `;
  }

  function viewCable() {
    page("Cable");
    const first = Data.cables[0];
    return `
      <form class="panel form" id="cable-form">
        <h2>Cable subscription</h2>
        ${field(
          "cable-plan",
          "Bouquet*",
          `<select id="cable-plan">${Data.cables
            .map((item) => `<option value="${esc(item.id)}">${esc(item.provider)} ${esc(item.name)} = ${naira(item.price)}</option>`)
            .join("")}</select>`
        )}
        ${field("cable-card", "Smartcard / IUC*", `<input id="cable-card" inputmode="numeric" />`)}
        <p class="hint" id="cable-total">Bouquet ${naira(first.price)} + fee ${naira(Data.billFee)}.</p>
        ${errorBox()}
        <button class="btn btn-navy wide" type="submit">Subscribe</button>
      </form>
    `;
  }

  function viewExam() {
    page("Result checker");
    return `
      <form class="panel form" id="exam-form">
        <h2>Result checker</h2>
        ${field("exam-board", "Exam*", `<select id="exam-board">${options(Data.exams, "waec", (item) => `${item.name} = ${naira(item.price)}`)}</select>`)}
        ${field("exam-qty", "Quantity*", `<input id="exam-qty" type="number" min="1" max="5" value="1" />`)}
        <p class="hint" id="exam-total">Total ${naira(Data.exams[0].price)}.</p>
        ${errorBox()}
        <button class="btn btn-navy wide" type="submit">Buy pin</button>
      </form>
    `;
  }

  function viewCash() {
    page("Airtime to cash");
    return `
      <form class="panel form" id="cash-form">
        <h2>Airtime to cash</h2>
        <p class="lede">This demo credits 80% of the airtime value into the wallet. It does not collect real airtime.</p>
        ${field("cash-network", "Network*", `<select id="cash-network">${options(Data.networks, "MTN", (item) => item.id)}</select>`)}
        ${field("cash-phone", "Phone sending the airtime*", `<input id="cash-phone" inputmode="numeric" />`)}
        ${field("cash-amount", "Airtime amount*", `<input id="cash-amount" inputmode="numeric" placeholder="1000" />`, "Minimum ₦500. Wallet receives 80%.")}
        <div class="row-2">
          ${field("cash-bank", "Bank name*", `<input id="cash-bank" placeholder="JayPay" />`)}
          ${field("cash-acct", "Account number*", `<input id="cash-acct" inputmode="numeric" />`)}
        </div>
        ${field("cash-name", "Account name*", `<input id="cash-name" />`)}
        <p class="hint" id="cash-total"></p>
        ${errorBox()}
        <button class="btn btn-navy wide" type="submit">Convert</button>
      </form>
    `;
  }

  function viewSms() {
    page("Bulk SMS");
    return `
      <form class="panel form" id="sms-form">
        <h2>Bulk SMS</h2>
        ${field("sms-from", "Sender name*", `<input id="sms-from" maxlength="11" placeholder="BiggestJay" />`, "3 to 11 letters.")}
        ${field("sms-to", "Recipients*", `<textarea id="sms-to" placeholder="0803..., 0806..."></textarea>`, "Separate numbers with commas or new lines.")}
        ${field("sms-body", "Message*", `<textarea id="sms-body" maxlength="480"></textarea>`)}
        <p class="hint" id="sms-total">${naira(Data.smsRate)} per 160 characters, per number.</p>
        ${errorBox()}
        <button class="btn btn-navy wide" type="submit">Send SMS</button>
      </form>
    `;
  }

  function viewBonus() {
    page("Bonus");
    const db = Store.get();
    return `
      <section class="panel stack">
        <h2>Bonus to wallet</h2>
        <p class="lede">Referral commission sits here until you move it.</p>
        <p class="figure">${naira(db.wallet.bonus)}</p>
        ${errorBox()}
        <button class="btn btn-navy" type="button" data-act="convert-bonus" ${db.wallet.bonus < 1 ? "disabled" : ""}>Move bonus to wallet</button>
      </section>
    `;
  }

  function viewFund() {
    page("Fund wallet");
    return `
      <form class="panel form" id="fund-form">
        <div class="fund-head">
          <h2>Fund account with JayPay (ATM / bank transfer)</h2>
          <p class="lede">Demo only. Confirming payment adds the amount on this browser. No bank is contacted.</p>
        </div>
        <div class="fund-grid">
          <div class="form">
            ${field("fund-amount", "Amount*", `<input id="fund-amount" inputmode="numeric" placeholder="1000" />`)}
            <div class="totals">
              <div>Transaction charge <strong id="fund-charge">${naira(0)}</strong></div>
              <div>Total <strong id="fund-total">${naira(0)}</strong></div>
            </div>
            ${errorBox()}
            <button class="btn btn-gold wide" type="submit">Continue to Funding</button>
          </div>
          <aside class="pay-note">
            <strong>Payment</strong>
            <p>Accepted cards in the live product would be Visa, Mastercard, and Verve. This demo uses the virtual account only.</p>
          </aside>
        </div>
        <p class="brand-lockup">jaypay</p>
      </form>
    `;
  }

  function viewVirtual() {
    page("Virtual account");
    const db = Store.get();
    const pending = Store.pending();
    return `
      <div class="stack">
        ${
          pending
            ? `<section class="panel">
                <h2>Confirm demo funding</h2>
                <p>Wallet receives <strong>${naira(pending.amount)}</strong>. Charge <strong>${naira(pending.charge)}</strong>. You would pay <strong>${naira(pending.total)}</strong>.</p>
                <button class="btn btn-gold" type="button" data-act="confirm-fund">I have paid — credit wallet</button>
              </section>`
            : `<section class="panel"><h2>Virtual account</h2><p class="lede">Enter an amount first, then come back to credit the demo wallet.</p><a class="btn btn-gold" href="#/fund">Enter amount</a></section>`
        }
        <section class="vaccount">
          <h2>JayPay</h2>
          <p>Account Number</p>
          <p class="acct-no">${esc(db.account.number)} <button class="copy" type="button" data-act="copy" data-copy="${esc(db.account.number)}">Copy</button></p>
          <p>Account Name: ${esc(db.account.name)}</p>
          <p>Bank Name: ${esc(db.account.bank)}</p>
          <div class="charge-tag"><strong>${naira(db.account.charge)}</strong><br />CHARGE</div>
        </section>
      </div>
    `;
  }

  function viewHistory() {
    page("Transactions");
    const db = Store.get();
    const rows = db.transactions.filter((item) => state.filter === "all" || item.type === state.filter);
    const pills = Data.filters
      .map(
        (item) =>
          `<button class="filter ${state.filter === item.id ? "active" : ""}" type="button" data-act="filter" data-filter="${item.id}">${esc(item.label)}</button>`
      )
      .join("");
    const list = rows.length
      ? rows
          .map(
            (item) => `
          <article class="tx">
            <div>
              <h3>${esc(item.title)}</h3>
              <p>${esc(item.detail)} · ${esc(item.id)} · ${esc(stamp(item.at))}</p>
            </div>
            <div class="amt ${item.direction}">${item.direction === "credit" ? "+" : "−"}${naira(item.amount)}</div>
          </article>`
          )
          .join("")
      : `<div class="empty">No transactions in this filter yet.</div>`;
    return `
      <section class="panel">
        <h2>Account history</h2>
        <p class="muted">FILTER</p>
        <div class="filters">${pills}</div>
        ${list}
      </section>
    `;
  }

  function viewWallet() {
    page("Wallet summary");
    const db = Store.get();
    const credits = db.transactions.filter((item) => item.direction === "credit").slice(0, 5);
    const debits = db.transactions.filter((item) => item.direction === "debit").slice(0, 5);
    const lines = (items) =>
      items.length
        ? items
            .map(
              (item) =>
                `<article class="tx"><div><h3>${esc(item.title)}</h3><p>${esc(stamp(item.at))}</p></div><div class="amt ${item.direction}">${naira(item.amount)}</div></article>`
            )
            .join("")
        : `<p class="empty">Nothing yet.</p>`;
    return `
      <div class="stack">
        <section class="panel">
          <h2>Wallet summary</h2>
          <dl class="stats">
            <div class="stat"><dt>BALANCE</dt><dd>${naira(db.wallet.balance)}</dd></div>
            <div class="stat"><dt>FUNDING</dt><dd>${naira(db.wallet.totalFunding)}</dd></div>
            <div class="stat"><dt>SPENT</dt><dd>${naira(db.wallet.totalSpent)}</dd></div>
          </dl>
          <p class="hint">Bonus waiting: ${naira(db.wallet.bonus)}. <a href="#/bonus">Move it</a>.</p>
        </section>
        <div class="split">
          <section class="panel"><h2>Money in</h2>${lines(credits)}</section>
          <section class="panel"><h2>Money out</h2>${lines(debits)}</section>
        </div>
      </div>
    `;
  }

  function viewReferrals() {
    page("Referrals");
    const db = Store.get();
    const rows = db.referrals.length
      ? db.referrals
          .map(
            (item) =>
              `<article class="tx"><div><h3>${esc(item.name)}</h3><p>Spent ${naira(item.spent)} · joined ${esc(stamp(item.at))}</p></div><div class="amt credit">+${naira(item.commission)}</div></article>`
          )
          .join("")
      : `<p class="empty">No referrals yet. Share the code and commission will show here.</p>`;
    return `
      <section class="panel stack">
        <h2>My referrals</h2>
        <p>Share code <strong>${esc(db.user.referral)}</strong>. This demo pays 2% of a referral's spend into bonus.</p>
        <button class="btn btn-line" type="button" data-act="copy" data-copy="${esc(db.user.referral)}">Copy code</button>
        ${rows}
      </section>
    `;
  }

  function viewPricing() {
    page("Pricing");
    const db = Store.get();
    const tabs = Data.networks
      .map(
        (item) =>
          `<button class="net-tab ${state.priceNet === item.id ? "active" : ""}" type="button" data-act="price-net" data-net="${item.id}">${esc(item.id)}</button>`
      )
      .join("");
    const mine = db.user.package;
    const head = Data.packages
      .map((item) => `<th class="${item.id === mine ? "mine" : ""}">${esc(item.name)}</th>`)
      .join("");
    const body = Data.plans
      .filter((item) => item.network === state.priceNet)
      .map((item) => {
        const cells = Data.packages
          .map((pkg) => `<td class="${pkg.id === mine ? "mine" : ""}">${naira(item.prices[pkg.id])}</td>`)
          .join("");
        return `<tr><td>${esc(item.size)}</td><td>${esc(item.type)}</td>${cells}<td>${esc(item.validity)}</td></tr>`;
      })
      .join("");
    return `
      <div class="price-wrap" data-net="${esc(state.priceNet)}">
        <div class="price-tools">${tabs}</div>
        <h2 class="price-title">${esc(state.priceNet)} DATA</h2>
        <p>Your column is ${esc(packageName(mine))}.</p>
        <table class="price-table">
          <thead><tr><th>Plan Size</th><th>Type</th>${head}<th>Validity</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  }

  function viewAccount() {
    page("Account");
    const db = Store.get();
    const pkgs = Data.packages
      .map(
        (item) => `
        <button class="pkg ${db.user.package === item.id ? "active" : ""}" type="button" data-act="set-package" data-package="${item.id}">
          <strong>${esc(item.name)}</strong>
          <small>${esc(item.blurb)}</small>
        </button>`
      )
      .join("");
    return `
      <div class="stack">
        <form class="panel form" id="profile-form">
          <h2>Account</h2>
          <p class="hint">Username ${esc(db.user.username)} · joined ${esc(stamp(db.user.joined))}</p>
          ${field("profile-name", "Name", `<input id="profile-name" value="${esc(db.user.name)}" />`)}
          ${field("profile-email", "Email", `<input id="profile-email" type="email" value="${esc(db.user.email)}" />`)}
          ${field("profile-phone", "Phone", `<input id="profile-phone" value="${esc(db.user.phone)}" />`)}
          ${errorBox()}
          <button class="btn btn-navy" type="submit">Save profile</button>
        </form>
        <section class="panel">
          <h2>Package</h2>
          <div class="pkgs">${pkgs}</div>
        </section>
        <form class="panel form" id="password-form">
          <h2>Password</h2>
          ${field("pass-current", "Current password", `<input id="pass-current" type="password" />`)}
          <div class="row-2">
            ${field("pass-next", "New password", `<input id="pass-next" type="password" />`)}
            ${field("pass-confirm", "Confirm", `<input id="pass-confirm" type="password" />`)}
          </div>
          <p class="form-error" id="pass-error" hidden></p>
          <button class="btn btn-line" type="submit">Update password</button>
        </form>
      </div>
    `;
  }

  function viewSettings() {
    page("Settings");
    const db = Store.get();
    return `
      <section class="panel stack">
        <h2>Settings</h2>
        <label class="check"><input id="sms-alerts" type="checkbox" ${db.settings.smsAlerts ? "checked" : ""} data-act="sms-alerts" /> SMS alerts on this demo</label>
        <p class="hint">Alerts stay on this device. Nothing is sent to a phone.</p>
        <button class="btn btn-line" type="button" data-act="ask-reset">Clear this account</button>
      </section>
    `;
  }

  function viewApi() {
    page("Developer API");
    const db = Store.get();
    return `
      <div class="stack">
        <section class="panel stack">
          <h2>Developer API</h2>
          <p class="lede">Sample key for this browser. It does not call a live server.</p>
          <div class="api-key"><span>${esc(db.apiKey)}</span><button class="btn btn-white" type="button" data-act="copy" data-copy="${esc(db.apiKey)}">Copy</button></div>
          <button class="btn btn-line" type="button" data-act="rotate-key">Regenerate key</button>
        </section>
        <section class="panel">
          <h2>Data purchase</h2>
          <pre>POST https://api.biggestjay.demo/v1/data
Authorization: Bearer ${esc(db.apiKey)}

{
  "network": "MTN",
  "plan": "1.0GB",
  "phone": "08031234567"
}</pre>
          <p class="hint">Prices follow the API user column once a real key is issued. This page is documentation only.</p>
        </section>
      </div>
    `;
  }

  const views = {
    dashboard: viewDashboard,
    data: viewData,
    airtime: viewAirtime,
    cards: viewCards,
    electricity: viewElectricity,
    cable: viewCable,
    exam: viewExam,
    cash: viewCash,
    sms: viewSms,
    bonus: viewBonus,
    fund: viewFund,
    virtual: viewVirtual,
    history: viewHistory,
    wallet: viewWallet,
    referrals: viewReferrals,
    pricing: viewPricing,
    account: viewAccount,
    settings: viewSettings,
    api: viewApi,
  };

  function renderView() {
    const view = views[state.route] || viewDashboard;
    const main = document.getElementById("view");
    main.innerHTML = view();
    if (state.route === "pricing") main.style.padding = "0";
    else main.style.padding = "";
  }

  function paint() {
    renderSidebar();
    renderTop();
    renderView();
  }

  function showGate() {
    document.getElementById("shell").hidden = true;
    document.getElementById("fab").hidden = true;
    document.getElementById("chat").hidden = true;
    state.chatOpen = false;
    const gate = document.getElementById("gate");
    gate.hidden = false;
    const register = state.mode === "register";
    gate.innerHTML = `
      <div class="gate">
        <section class="gate-aside">
          <span class="mark">BJ</span>
          <h1>Biggest <em>Jay</em></h1>
          <p>Airtime, data, bills, and wallet funding for a retail desk.</p>
          <ul class="gate-points">
            <li>MTN, Airtel, Glo, and 9mobile</li>
            <li>Package prices for Smart Earner through API user</li>
            <li>JayPay virtual account in this demo</li>
          </ul>
        </section>
        <section class="gate-main">
          <form class="gate-card" id="gate-form">
            <h2>${register ? "Create a desk" : "Sign in"}</h2>
            ${register ? field("reg-name", "Your name", `<input id="reg-name" required />`) : ""}
            ${field("gate-user", "Username", `<input id="gate-user" autocomplete="username" required />`)}
            ${field("gate-pass", "Password", `<input id="gate-pass" type="password" autocomplete="${register ? "new-password" : "current-password"}" required />`)}
            ${errorBox()}
            <button class="btn btn-navy wide" type="submit">${register ? "Create account" : "Sign in"}</button>
            ${
              register
                ? `<button class="btn btn-line wide" type="button" data-act="mode-login">Back to sign in</button>`
                : `<button class="btn btn-line wide" type="button" data-act="mode-register">Create account</button>`
            }
            <p class="hint">The wallet stays in this browser. Clear it anytime from Settings.</p>
          </form>
        </section>
      </div>
    `;
  }

  function enter() {
    document.getElementById("gate").hidden = true;
    document.getElementById("shell").hidden = false;
    document.getElementById("fab").hidden = false;
    const hash = location.hash.replace("#/", "");
    state.route = views[hash] ? hash : "dashboard";
    history.replaceState(null, "", "#/" + state.route);
    paint();
  }

  function logout() {
    Store.signOut();
    closeModal();
    state.navOpen = false;
    state.mode = "login";
    showGate();
  }

  function guardBusy() {
    if (state.busy) return true;
    state.busy = true;
    return false;
  }

  function finishBusy() {
    state.busy = false;
  }

  function onSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.id) return;
    event.preventDefault();
    const id = form.id;
    if (id === "gate-form") return submitGate();
    if (id === "data-form") return submitData();
    if (id === "airtime-form") return submitAirtime();
    if (id === "card-form") return submitCards();
    if (id === "power-form") return submitPower();
    if (id === "cable-form") return submitCable();
    if (id === "exam-form") return submitExam();
    if (id === "cash-form") return submitCash();
    if (id === "sms-form") return submitSms();
    if (id === "fund-form") return submitFund();
    if (id === "profile-form") return submitProfile();
    if (id === "password-form") return submitPassword();
    if (id === "chat-form") return submitChat();
  }

  function submitGate() {
    setError("");
    if (state.mode === "register") {
      const result = Store.register({
        name: document.getElementById("reg-name").value,
        username: document.getElementById("gate-user").value,
        password: document.getElementById("gate-pass").value,
      });
      if (!result.ok) return setError(result.error);
      enter();
      return;
    }
    const result = Store.signIn(document.getElementById("gate-user").value, document.getElementById("gate-pass").value);
    if (!result.ok) return setError(result.error);
    enter();
  }

  function submitData() {
    const plan = selectedPlan();
    const phone = normalizePhone(document.getElementById("data-phone").value);
    const network = document.getElementById("data-network").value;
    const bypass = document.getElementById("data-bypass").checked;
    const problem = phoneError(network, phone, bypass);
    if (!plan) return setError("Pick a plan.");
    if (problem) return setError(problem);
    const result = Store.debit(priceOf(plan), {
      type: "data",
      title: `${network} ${plan.size} ${plan.type}`,
      detail: `${phone} · ${plan.validity}`,
    });
    if (!result.ok) return setError(result.error);
    paint();
    receipt(result.tx);
  }

  function submitAirtime() {
    const network = document.getElementById("air-network").value;
    const phone = normalizePhone(document.getElementById("air-phone").value);
    const amount = Math.round(Number(document.getElementById("air-amount").value));
    const problem = phoneError(network, phone, document.getElementById("air-bypass").checked);
    if (problem) return setError(problem);
    if (amount < 50) return setError("Minimum airtime is ₦50.");
    const result = Store.debit(amount, {
      type: "airtime",
      title: `${network} airtime`,
      detail: phone,
    });
    if (!result.ok) return setError(result.error);
    paint();
    receipt(result.tx);
  }

  function submitCards() {
    const plan = Data.planById(document.getElementById("card-plan").value);
    const qty = Math.round(Number(document.getElementById("card-qty").value));
    if (!plan) return setError("Pick a plan.");
    if (qty < 1 || qty > 20) return setError("Print between 1 and 20 cards.");
    const total = priceOf(plan) * qty;
    const pins = Array.from({ length: qty }, () => ({ pin: pinCode(), serial: Store.get() && "SN" + Math.random().toString(36).slice(2, 8).toUpperCase() }));
    const result = Store.debit(total, {
      type: "pin",
      title: `${plan.network} ${plan.size} cards`,
      detail: `${qty} pin${qty > 1 ? "s" : ""}`,
    });
    if (!result.ok) return setError(result.error);
    Store.addBatch({
      title: `${plan.network} ${plan.size} ${plan.type}`,
      at: result.tx.at,
      pins: pins.map((item) => ({ pin: item.pin, serial: item.serial })),
    });
    paint();
    receipt(result.tx, `<p>${pins.map((item) => esc(item.pin)).join("<br />")}</p>`);
  }

  function submitPower() {
    const disco = Data.discos.find((item) => item.id === document.getElementById("power-disco").value);
    const kind = document.getElementById("power-type").value;
    const meter = document.getElementById("power-meter").value.replace(/\D/g, "");
    const units = Math.round(Number(document.getElementById("power-amount").value));
    if (!/^\d{10,13}$/.test(meter)) return setError("Meter number should be 10 to 13 digits.");
    if (units < 500) return setError("Minimum unit amount is ₦500.");
    const token = kind === "Prepaid" ? tokenCode() : "";
    const result = Store.debit(units + Data.billFee, {
      type: "bill",
      title: `${disco.id} electricity`,
      detail: `${kind} · meter ${meter}${token ? " · token " + token : ""}`,
    });
    if (!result.ok) return setError(result.error);
    paint();
    receipt(result.tx, token ? `<p>Token<br /><strong>${esc(token)}</strong></p>` : "");
  }

  function submitCable() {
    const plan = Data.cables.find((item) => item.id === document.getElementById("cable-plan").value);
    const card = document.getElementById("cable-card").value.replace(/\D/g, "");
    if (!/^\d{10,12}$/.test(card)) return setError("Enter the 10 to 12 digit smartcard or IUC.");
    const result = Store.debit(plan.price + Data.billFee, {
      type: "cable",
      title: `${plan.provider} ${plan.name}`,
      detail: `Smartcard ${card}`,
    });
    if (!result.ok) return setError(result.error);
    paint();
    receipt(result.tx);
  }

  function submitExam() {
    const exam = Data.exams.find((item) => item.id === document.getElementById("exam-board").value);
    const qty = Math.round(Number(document.getElementById("exam-qty").value));
    if (qty < 1 || qty > 5) return setError("Buy between 1 and 5 pins.");
    const pins = Array.from({ length: qty }, () => pinCode());
    const result = Store.debit(exam.price * qty, {
      type: "exam",
      title: `${exam.name} result pin`,
      detail: `${qty} pin${qty > 1 ? "s" : ""} · ${pins[0]}`,
    });
    if (!result.ok) return setError(result.error);
    paint();
    receipt(result.tx, `<p>${pins.map((pin) => esc(pin)).join("<br />")}</p>`);
  }

  function submitCash() {
    const phone = normalizePhone(document.getElementById("cash-phone").value);
    const amount = Math.round(Number(document.getElementById("cash-amount").value));
    const bank = document.getElementById("cash-bank").value.trim();
    const account = document.getElementById("cash-acct").value.replace(/\D/g, "");
    const name = document.getElementById("cash-name").value.trim();
    const problem = phoneError(document.getElementById("cash-network").value, phone, true);
    if (problem) return setError(problem);
    if (amount < 500) return setError("Minimum airtime to convert is ₦500.");
    if (!bank || !name || !/^\d{10}$/.test(account)) return setError("Enter the bank, a 10-digit account, and the account name.");
    const credit = Math.round(amount * Data.cashRate);
    const result = Store.credit(credit, {
      type: "cash",
      title: "Airtime to cash",
      detail: `${phone} · ${naira(amount)} at 80% · ${bank} ${account}`,
      funding: false,
    });
    if (!result.ok) return setError(result.error);
    paint();
    receipt(result.tx);
  }

  function parseRecipients(raw) {
    return raw
      .split(/[\s,;]+/)
      .map(normalizePhone)
      .filter(Boolean);
  }

  function submitSms() {
    const sender = document.getElementById("sms-from").value.trim();
    const recipients = parseRecipients(document.getElementById("sms-to").value);
    const body = document.getElementById("sms-body").value.trim();
    if (!/^[a-zA-Z0-9]{3,11}$/.test(sender)) return setError("Sender name needs 3 to 11 letters or numbers.");
    if (!recipients.length) return setError("Add at least one mobile number.");
    if (recipients.length > 100) return setError("Send to 100 numbers or fewer in this demo.");
    if (recipients.some((phone) => !/^0\d{10}$/.test(phone))) return setError("Every recipient needs to be an 11-digit mobile number.");
    if (body.length < 2) return setError("Write the message.");
    const pages = Math.max(1, Math.ceil(body.length / 160));
    const total = recipients.length * pages * Data.smsRate;
    const result = Store.debit(total, {
      type: "sms",
      title: "Bulk SMS",
      detail: `${sender} · ${recipients.length} numbers · ${pages} page${pages > 1 ? "s" : ""}`,
    });
    if (!result.ok) return setError(result.error);
    paint();
    receipt(result.tx);
  }

  function submitFund() {
    const amount = Math.round(Number(document.getElementById("fund-amount").value));
    if (amount < Data.minFund) return setError(`Minimum funding is ${naira(Data.minFund)}.`);
    Store.setPending({ amount, charge: Data.fundCharge, total: amount + Data.fundCharge });
    go("virtual");
  }

  function submitProfile() {
    const result = Store.saveProfile({
      name: document.getElementById("profile-name").value,
      email: document.getElementById("profile-email").value,
      phone: document.getElementById("profile-phone").value,
    });
    if (!result.ok) return setError(result.error);
    paint();
    toast("Profile saved");
  }

  function submitPassword() {
    const box = document.getElementById("pass-error");
    const result = Store.changePassword(
      document.getElementById("pass-current").value,
      document.getElementById("pass-next").value,
      document.getElementById("pass-confirm").value
    );
    box.hidden = result.ok;
    if (!result.ok) {
      box.textContent = result.error;
      return;
    }
    toast("Password updated");
    document.getElementById("password-form").reset();
  }

  function renderChat() {
    const chat = document.getElementById("chat");
    chat.hidden = !state.chatOpen;
    if (!state.chatOpen) return;
    chat.innerHTML = `
      <header>
        <h2>Biggest Jay support</h2>
        <button class="btn btn-line" type="button" data-act="toggle-chat">Close</button>
      </header>
      <div class="thread">
        ${state.messages
          .map((item) => `<p class="bubble ${item.from === "me" ? "mine" : ""}">${esc(item.text)}</p>`)
          .join("")}
      </div>
      <form id="chat-form">
        <input id="chat-text" placeholder="Ask about funding or data" required />
        <button class="btn btn-navy" type="submit">Send</button>
      </form>
    `;
    const thread = chat.querySelector(".thread");
    thread.scrollTop = thread.scrollHeight;
  }

  function replyFor(text) {
    const value = text.toLowerCase();
    if (value.includes("fund") || value.includes("bank") || value.includes("jaypay")) {
      return "Open Fund Wallet, enter an amount, then confirm on the JayPay account. The demo credits this browser only.";
    }
    if (value.includes("data") || value.includes("plan")) {
      return "Buy Data uses your package price. Pick the network, the plan type, and the phone number.";
    }
    if (value.includes("pin") || value.includes("card")) {
      return "Data card Printing saves pins on this device. You can print that list from the page.";
    }
    return "This is a demo desk, so nothing here moves real money. Ask about funding, data, airtime, bills, or pins.";
  }

  function submitChat() {
    const input = document.getElementById("chat-text");
    const text = input.value.trim();
    if (!text) return;
    state.messages.push({ from: "me", text });
    state.messages.push({ from: "desk", text: replyFor(text) });
    renderChat();
  }

  function updateFundPreview() {
    const amount = Math.round(Number(document.getElementById("fund-amount").value));
    const charge = amount >= Data.minFund ? Data.fundCharge : 0;
    document.getElementById("fund-charge").textContent = naira(charge);
    document.getElementById("fund-total").textContent = naira(amount > 0 ? amount + charge : 0);
  }

  function onInput(event) {
    const target = event.target;
    if (target.id === "data-network" || target.id === "data-type") refreshPlans();
    if (target.id === "data-plan") {
      const plan = Data.planById(target.value);
      if (plan) document.getElementById("data-amount").value = naira(priceOf(plan));
    }
    if (target.id === "card-network" || target.id === "card-type") refreshCardPlans();
    if (target.id === "card-plan" || target.id === "card-qty") updateCardTotal();
    if (target.id === "fund-amount") updateFundPreview();
    if (target.id === "power-amount") {
      const units = Math.round(Number(target.value) || 0);
      document.getElementById("power-total").textContent = units ? `Total ${naira(units + Data.billFee)} including fee.` : "";
    }
    if (target.id === "cable-plan") {
      const plan = Data.cables.find((item) => item.id === target.value);
      document.getElementById("cable-total").textContent = `Bouquet ${naira(plan.price)} + fee ${naira(Data.billFee)}.`;
    }
    if (target.id === "exam-board" || target.id === "exam-qty") {
      const exam = Data.exams.find((item) => item.id === document.getElementById("exam-board").value);
      const qty = Math.max(1, Number(document.getElementById("exam-qty").value) || 1);
      const note = document.getElementById("exam-total");
      if (note && exam) note.textContent = `Total ${naira(exam.price * qty)}.`;
    }
    if (target.id === "cash-amount") {
      const amount = Math.round(Number(target.value) || 0);
      document.getElementById("cash-total").textContent = amount ? `Wallet receives ${naira(Math.round(amount * Data.cashRate))}.` : "";
    }
    if (target.id === "sms-to" || target.id === "sms-body") {
      const count = parseRecipients(document.getElementById("sms-to").value).length;
      const pages = Math.max(1, Math.ceil((document.getElementById("sms-body").value.trim().length || 0) / 160));
      document.getElementById("sms-total").textContent = count
        ? `${count} numbers · ${pages} page${pages > 1 ? "s" : ""} · ${naira(count * pages * Data.smsRate)}.`
        : `${naira(Data.smsRate)} per 160 characters, per number.`;
    }
  }

  function onClick(event) {
    const link = event.target.closest("a[href^='#/']");
    if (link) {
      state.navOpen = false;
      if (location.hash === link.getAttribute("href")) renderSidebar();
    }
    const el = event.target.closest("[data-act]");
    if (!el) {
      if (event.target.id === "modal") closeModal();
      return;
    }
    const act = el.dataset.act;
    if (act === "open-nav") {
      state.navOpen = true;
      renderSidebar();
    }
    if (act === "close-nav") {
      state.navOpen = false;
      renderSidebar();
    }
    if (act === "toggle-menu") {
      const menu = el.dataset.menu;
      state.menus[menu] = !state.menus[menu];
      renderSidebar();
    }
    if (act === "logout") logout();
    if (act === "close-modal") closeModal();
    if (act === "toggle-chat") {
      state.chatOpen = !state.chatOpen;
      renderChat();
    }
    if (act === "mode-register") {
      state.mode = "register";
      showGate();
    }
    if (act === "mode-login") {
      state.mode = "login";
      showGate();
    }
    if (act === "copy") {
      const text = el.dataset.copy || "";
      navigator.clipboard?.writeText(text).then(
        () => toast("Copied"),
        () => toast(text)
      );
    }
    if (act === "filter") {
      state.filter = el.dataset.filter;
      renderView();
    }
    if (act === "price-net") {
      state.priceNet = el.dataset.net;
      renderView();
    }
    if (act === "airtime-chip") {
      document.getElementById("air-amount").value = el.dataset.amount;
      document.querySelectorAll(".chip").forEach((chip) => chip.classList.toggle("active", chip === el));
    }
    if (act === "set-package") {
      Store.setPackage(el.dataset.package);
      paint();
      toast("Package is now " + packageName(el.dataset.package));
    }
    if (act === "convert-bonus") {
      const result = Store.convertBonus();
      if (!result.ok) return setError(result.error);
      paint();
      receipt(result.tx);
    }
    if (act === "confirm-fund") {
      const pending = Store.pending();
      if (!pending) return;
      const result = Store.credit(pending.amount, {
        type: "bank",
        title: "Wallet funding",
        detail: "JayPay transfer",
        funding: true,
      });
      Store.clearPending();
      if (!result.ok) return;
      paint();
      receipt(result.tx);
    }
    if (act === "sms-alerts") {
      Store.setSetting("smsAlerts", el.checked);
      toast(el.checked ? "SMS alerts on" : "SMS alerts off");
    }
    if (act === "ask-reset") {
      openModal(`
        <h2>Clear this account?</h2>
        <p>This removes the wallet, history, and sign-in from this browser.</p>
        <div class="modal-actions">
          <button class="btn btn-line" type="button" data-act="close-modal">Cancel</button>
          <button class="btn btn-navy" type="button" data-act="reset-demo">Clear</button>
        </div>
      `);
    }
    if (act === "reset-demo") {
      Store.reset();
      closeModal();
      state.mode = "register";
      showGate();
      toast("Account cleared");
    }
    if (act === "rotate-key") {
      Store.rotateKey();
      renderView();
      toast("New sample key");
    }
    if (act === "print-pins") window.print();
    if (el.closest("a[href^='#/']")) {
      state.navOpen = false;
    }
  }

  function onHash() {
    if (!Store.session()) return;
    const hash = location.hash.replace("#/", "");
    state.route = views[hash] ? hash : "dashboard";
    state.navOpen = false;
    paint();
  }

  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);
  document.addEventListener("input", onInput);
  document.addEventListener("change", onInput);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeModal();
    state.chatOpen = false;
    state.navOpen = false;
    renderChat();
    if (Store.session()) renderSidebar();
  });
  window.addEventListener("hashchange", onHash);

  if (!Store.hasAccount()) state.mode = "register";
  if (Store.session()) enter();
  else showGate();
})();
