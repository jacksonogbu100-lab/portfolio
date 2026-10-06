const data = window.ND;
const CART_KEY = "nd_cart_v2";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function money(n) {
  if (!n) return "Ask";
  return (
    "₦" +
    Number(n).toLocaleString("en-NG", {
      maximumFractionDigits: 0,
    })
  );
}

function waLink(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function activeBranch() {
  return (data.branches && data.branches[0]) || {
    whatsapp: data.whatsapp,
    phone: data.phone,
    name: "Kitchen",
  };
}

function catalog() {
  return [
    ...(data.featured || []),
    ...(data.local || []),
    ...(data.world || []),
    ...(data.softDrinks || []),
    ...(data.localDrinks || []),
  ];
}

function findItem(id) {
  return catalog().find((d) => d.id === id);
}

function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.amount * i.qty, 0);
}

function dishHTML(d) {
  return `<article class="dish">
    <h4>${d.name}</h4>
    <div class="price">${d.price}</div>
    <p>${d.desc}</p>
    <button type="button" class="btn btn-primary btn-sm add-btn" data-add="${d.id}">Add to cart</button>
  </article>`;
}

function renderCart() {
  const count = cartCount();
  $("#cart-count").textContent = String(count);
  $("#cart-count").hidden = count === 0;
  $("#cart-total").textContent = money(cartTotal());

  if (!cart.length) {
    $("#cart-items").innerHTML = `<p class="cart-empty">Your cart is empty. Add dishes from the menu.</p>`;
    return;
  }

  $("#cart-items").innerHTML = cart
    .map((item) => {
      const line = item.amount * item.qty;
      return `<div class="cart-line" data-id="${item.id}">
        <div>
          <strong>${item.name}</strong>
          <span>${item.amount ? `${money(item.amount)} each` : "Price on WhatsApp"}</span>
        </div>
        <div class="cart-qty">
          <button type="button" data-dec="${item.id}" aria-label="Decrease">−</button>
          <em>${item.qty}</em>
          <button type="button" data-inc="${item.id}" aria-label="Increase">+</button>
        </div>
        <div class="cart-line-total">${money(line)}</div>
        <button type="button" class="cart-remove" data-remove="${item.id}" aria-label="Remove">×</button>
      </div>`;
    })
    .join("");
}

function addToCart(id) {
  const dish = findItem(id);
  if (!dish) return;
  const existing = cart.find((c) => c.id === id);
  if (existing) existing.qty += 1;
  else
    cart.push({
      id: dish.id,
      name: dish.name,
      amount: dish.amount,
      qty: 1,
    });
  saveCart();
  renderCart();
  openCart();
}

function setQty(id, qty) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  if (qty <= 0) cart = cart.filter((c) => c.id !== id);
  else item.qty = qty;
  saveCart();
  renderCart();
}

function openCart() {
  $("#cart-drawer").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("#cart-drawer").hidden = true;
  document.body.style.overflow = "";
}

function checkoutWhatsApp() {
  if (!cart.length) {
    alert("Add food items to your cart first.");
    return;
  }
  const lines = cart.map((i) =>
    i.amount ? `• ${i.qty}× ${i.name} — ${money(i.amount * i.qty)}` : `• ${i.qty}× ${i.name}`,
  );
  const priced = cart.every((i) => i.amount);
  const select = $("#cart-branch");
  const number = (select && select.value) || data.whatsapp;
  const branch =
    (data.branches || []).find((b) => b.whatsapp === number) || activeBranch();
  const text = [
    "Naija Dishes — order",
    ...lines,
    priced ? `Total: ${money(cartTotal())}` : "Please confirm today’s prices.",
    `Branch: ${branch.name}`,
  ].join("\n");
  window.open(waLink(number, text), "_blank");
}

function render() {
  $("#tagline").textContent = data.tagline;
  $("#lead").textContent = data.lead;
  const addressEl = $("#address");
  if (addressEl) addressEl.textContent = data.address;
  $("#year").textContent = new Date().getFullYear();

  $("#specials-row").innerHTML = data.specials
    .map(
      (s) =>
        `<div class="special-card"><strong>${s.name}</strong><span>${s.note}</span></div>`,
    )
    .join("");

  const featured = data.featured || [];
  $("#menu-featured").innerHTML = featured
    .map(
      (d, i) => `
      <article class="featured-card ${i === 0 ? "featured-card-hero" : ""}">
        <span class="featured-tag">${d.tag || "Featured"}</span>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
        <strong class="price">${d.price}</strong>
        <button type="button" class="btn btn-primary btn-sm add-btn" data-add="${d.id}">Add to cart</button>
      </article>`,
    )
    .join("");

  $("#local-dishes").innerHTML = data.local.map(dishHTML).join("");
  $("#world-dishes").innerHTML = data.world.map(dishHTML).join("");
  $("#soft-drinks").innerHTML = (data.softDrinks || []).map(dishHTML).join("");
  $("#local-drinks").innerHTML = (data.localDrinks || []).map(dishHTML).join("");

  const videos = data.videos || [];
  const videoBox = $("#place-videos");
  if (videoBox) {
    videoBox.innerHTML = videos
      .map(
        (v) => `<article class="video-card">
          <div class="video-frame">
            <iframe
              src="https://www.tiktok.com/embed/v2/${v.id}"
              title="${v.title}"
              loading="lazy"
              allow="fullscreen; encrypted-media"
              allowfullscreen
            ></iframe>
          </div>
          <h3>${v.title}</h3>
          <p>${v.caption}</p>
          <a class="btn btn-ghost btn-sm" href="https://www.tiktok.com/@naija.dishes.ng/video/${v.id}" target="_blank" rel="noopener">Watch on TikTok</a>
        </article>`,
      )
      .join("");
  }

  const picks = $("#meal-picks");
  const player = $("#meal-player");
  if (picks && data.mealClips) {
    picks.innerHTML = data.mealClips
      .map(
        (c, i) => `<button type="button" class="meal-pick${i === 0 ? " is-on" : ""}" data-clip="${c.id}" data-title="${c.title}">
          <strong>${c.title}</strong>
          <span>${c.caption}</span>
        </button>`,
      )
      .join("");
    if (player && data.mealClips[0]) {
      player.src = `https://www.tiktok.com/embed/v2/${data.mealClips[0].id}`;
      player.title = data.mealClips[0].title;
    }
  }

  const branchOptions = (data.branches || [])
    .map((b) => `<option value="${b.whatsapp}">${b.name} · ${b.phone}</option>`)
    .join("");
  ["#cart-branch", "#o-branch", "#f-branch"].forEach((sel) => {
    const el = $(sel);
    if (el) el.innerHTML = branchOptions;
  });

  const branchBox = $("#branches");
  if (branchBox && data.branches) {
    branchBox.innerHTML = data.branches
      .map(
        (b) => `<article class="branch-card">
          <h3>${b.name}</h3>
          <p>${b.address}</p>
          <div class="branch-actions">
            <a class="btn btn-primary btn-sm" href="${waLink(b.whatsapp, `Hi Naija Dishes ${b.name} — I’d like to order.`)}" target="_blank" rel="noopener">WhatsApp ${b.phone}</a>
            <a class="btn btn-ghost btn-sm" href="tel:${b.phone}">Call</a>
            <button type="button" class="btn btn-ghost btn-sm" data-map="${b.id}">Map</button>
          </div>
        </article>`,
      )
      .join("");
  }

  $("#hours").innerHTML = data.hours
    .map((h) => `<div><span>${h.day}</span><strong>${h.time}</strong></div>`)
    .join("");

  $("#faq").innerHTML = data.faqs
    .map(
      (f) =>
        `<details><summary>${f.q}</summary><p>${f.a}</p></details>`,
    )
    .join("");

  const gwarinpa = (data.branches && data.branches[0]) || { phone: data.phone, whatsapp: data.whatsapp, name: "Gwarinpa" };
  const jahi = (data.branches && data.branches[1]) || gwarinpa;
  $("#call-link").href = `tel:${gwarinpa.phone}`;
  const callJahi = $("#call-jahi");
  if (callJahi) callJahi.href = `tel:${jahi.phone}`;
  $("#mail-link").href = `mailto:${data.email}`;
  const waText = "Hi Naija Dishes — I’d like to order.";
  const wa = waLink(gwarinpa.whatsapp, waText);
  const waJahi = waLink(jahi.whatsapp, waText);
  $("#wa-link").href = wa;
  $("#hero-whatsapp").href = wa;
  const heroJahi = $("#hero-whatsapp-jahi");
  if (heroJahi) heroJahi.href = waJahi;
  const waJahiLink = $("#wa-link-jahi");
  if (waJahiLink) waJahiLink.href = waJahi;
  const floatBtn = $("#wa-float");
  if (floatBtn) floatBtn.href = wa;
  const footerWa = $("#footer-wa");
  if (footerWa) footerWa.href = wa;
  const footerWaJahi = $("#footer-wa-jahi");
  if (footerWaJahi) footerWaJahi.href = waJahi;
  const ig = $("#contact-instagram");
  if (ig && data.instagram) ig.href = data.instagram;
  const footerIg = $("#footer-ig");
  if (footerIg && data.instagram) footerIg.href = data.instagram;

  const site = data.website || "#";
  const siteLabel = data.websiteLabel || site.replace(/^https?:\/\//, "");
  ["#visit-website", "#contact-website", "#footer-website"].forEach((sel) => {
    const el = $(sel);
    if (!el) return;
    el.href = site;
    el.textContent = siteLabel;
  });

  renderCart();
}

function bindNav() {
  const toggle = $("#nav-toggle");
  const nav = $("#nav");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("open")),
  );

  const links = [...nav.querySelectorAll("a[href^='#']")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach((sec) => {
      if (sec.offsetTop <= y) current = sec;
    });
    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${current.id}`),
    );
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function bindForm() {
  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#f-name").value.trim();
    const phone = $("#f-phone").value.trim();
    const date = $("#f-date").value;
    const guests = $("#f-guests").value;
    const msg = $("#f-msg").value.trim();
    const note = $("#form-note");

    if (!name || !phone || !date) {
      note.hidden = false;
      note.style.color = "#f5a8a8";
      note.textContent = "Please fill name, phone, and date.";
      return;
    }

    const branch = branchByNumber($("#f-branch") && $("#f-branch").value);
    const text = [
      "Naija Dishes reservation",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Branch: ${branch.name}`,
      `Date: ${date}`,
      `Guests: ${guests}`,
      `Message: ${msg || "—"}`,
    ].join("\n");
    window.open(waLink(branch.whatsapp, text), "_blank");

    note.hidden = false;
    note.style.color = "#9fdfc0";
    note.textContent = "Opening WhatsApp with your request…";
    e.target.reset();
    $("#f-guests").value = "2";
  });
}

function branchByNumber(number) {
  return (data.branches || []).find((b) => b.whatsapp === number) || activeBranch();
}

function bindOrder() {
  const form = $("#order-form");
  if (!form) return;
  const type = $("#o-type");
  const addressWrap = $("#o-address-wrap");
  const syncAddress = () => {
    const delivery = type.value === "Delivery";
    addressWrap.hidden = !delivery;
  };
  type.addEventListener("change", syncAddress);
  syncAddress();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#o-name").value.trim();
    const phone = $("#o-phone").value.trim();
    const address = $("#o-address").value.trim();
    const note = $("#o-note").value.trim();
    const how = type.value;
    const status = $("#order-note");
    const branch = branchByNumber($("#o-branch").value);

    if (!name || !phone || (how === "Delivery" && !address)) {
      status.hidden = false;
      status.style.color = "#f5a8a8";
      status.textContent =
        how === "Delivery"
          ? "Add your name, phone, and Abuja address."
          : "Add your name and phone.";
      return;
    }

    const lines = cart.map((i) => `• ${i.qty}× ${i.name}`);
    const text = [
      "Naija Dishes order",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Branch: ${branch.name}`,
      `Type: ${how}`,
      how === "Delivery" ? `Address: ${address}` : "",
      lines.length ? "Cart:" : "",
      ...lines,
      note ? `Note: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(branch.whatsapp, text), "_blank");
    status.hidden = false;
    status.style.color = "#9fdfc0";
    status.textContent = `Opening WhatsApp for ${branch.name}…`;
  });
}

function bindCart() {
  $("#cart-open").addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  $("#cart-close-bg").addEventListener("click", closeCart);
  $("#cart-clear").addEventListener("click", () => {
    cart = [];
    saveCart();
    renderCart();
  });
  $("#cart-whatsapp").addEventListener("click", checkoutWhatsApp);

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) addToCart(add.dataset.add);

    const inc = e.target.closest("[data-inc]");
    if (inc) {
      const item = cart.find((c) => c.id === inc.dataset.inc);
      if (item) setQty(item.id, item.qty + 1);
    }

    const dec = e.target.closest("[data-dec]");
    if (dec) {
      const item = cart.find((c) => c.id === dec.dataset.dec);
      if (item) setQty(item.id, item.qty - 1);
    }

    const remove = e.target.closest("[data-remove]");
    if (remove) setQty(remove.dataset.remove, 0);

    const clip = e.target.closest("[data-clip]");
    if (clip) {
      const frame = $("#meal-player");
      if (frame) {
        frame.src = `https://www.tiktok.com/embed/v2/${clip.dataset.clip}`;
        frame.title = clip.dataset.title || "Meal video";
      }
      $$(".meal-pick").forEach((btn) => btn.classList.toggle("is-on", btn === clip));
    }

    const mapBtn = e.target.closest("[data-map]");
    if (mapBtn && data.branches) {
      const branch = data.branches.find((b) => b.id === mapBtn.dataset.map);
      const frame = $("#branch-map");
      if (branch && frame) {
        frame.src = branch.map;
        frame.title = `Map of Naija Dishes ${branch.name}`;
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
}

render();
bindNav();
bindForm();
bindOrder();
bindCart();
