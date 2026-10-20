const SsimsUi = {
  escape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  },

  formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return this.escape(value);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  },

  initials(name) {
    return String(name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  },

  icon(name) {
    const icons = {
      dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>',
      records: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 19.5c.8-3.4 3.4-5.2 6.5-5.2s5.7 1.8 6.5 5.2"/></svg>',
      academic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 5l9 5.5-9 5.5-9-5.5Z"/><path d="M7 13v4.5c0 .4 2.2 2 5 2s5-1.6 5-2V13"/></svg>',
      payments: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></svg>',
      documents: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"/><path d="M14 3.5V8h5"/></svg>',
      requests: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14v12H5z"/><path d="M8 10h8M8 14h5"/></svg>',
      messages: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5h16v11H7l-3 3v-14Z"/></svg>',
      settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a7.8 7.8 0 0 0 .1-2 7.8 7.8 0 0 0-.1-2l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L13 2h-2l-.3 2.5a8 8 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0-.1 2 7.8 7.8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 1.7 1L11 22h2l.3-2.5a8 8 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z"/></svg>',
      logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2"/><path d="M4 12h10M11 9l3 3-3 3"/></svg>',
      search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></svg>',
      bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V10a6 6 0 1 1 12 0v6l1.5 2H4.5L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
      level: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5h4v14H4Zm6 0V9h4v10h-4Zm6 0v-6h4v6h-4Z"/></svg>',
      cgpa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v4c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10V7l-8-4Z"/></svg>',
      session: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
      fees: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 10.5c.6-1 1.5-1.5 2.5-1.5s2 .6 2 1.8c0 2.2-4 1.4-4 3.5 0 1 .8 1.7 2 1.7s1.8-.5 2.4-1.4"/></svg>',
      results: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V5h9l5 5v9H5Z"/><path d="M14 5v5h5"/><path d="M8 13h8M8 16h5"/></svg>',
      register: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l2 3H6l2-3Z"/><rect x="5" y="7" width="14" height="13" rx="2"/><path d="M9 12h6M9 15h4"/></svg>',
      pay: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>',
      upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V7M8.5 10.5 12 7l3.5 3.5"/><path d="M5 19h14"/></svg>',
      letter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4z"/><path d="M4 7l8 6 8-6"/></svg>',
      timetable: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M9 14h2M13 14h2M9 17h6"/></svg>',
      edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="M13 7l4 4"/></svg>',
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v10H4z"/><path d="M4 7l8 6 8-6"/></svg>',
      phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h4l1.5 4-2.5 1.5a12 12 0 0 0 6.5 6.5L18 13.5 22 15v4a2 2 0 0 1-2 2C10.6 21 3 13.4 3 4a2 2 0 0 1 2-2h2Z"/></svg>',
      cap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10 12 5l9 5-9 5-9-5Z"/><path d="M7 12.5V16c0 .5 2.2 2 5 2s5-1.5 5-2v-3.5"/><path d="M21 10v6"/></svg>',
    };
    return icons[name] || "";
  },

  avatar(name, extraClass = "") {
    return `<span class="avatar ${extraClass}" aria-hidden="true">${this.escape(this.initials(name))}</span>`;
  },

  statusClass(status) {
    const value = String(status || "").toLowerCase();
    if (["completed", "successful", "verified", "paid", "registered", "active"].includes(value)) return "ok";
    if (["view result", "pending", "due", "ongoing"].includes(value)) return "info";
    if (["updated"].includes(value)) return "warn";
    return "muted";
  },

  empty(title, body) {
    return `<div class="empty"><strong>${this.escape(title)}</strong><p>${this.escape(body)}</p></div>`;
  },

  flash(text, kind = "ok") {
    sessionStorage.setItem("ssims-flash", text);
    sessionStorage.setItem("ssims-flash-kind", kind);
  },

  takeFlash() {
    const text = sessionStorage.getItem("ssims-flash") || "";
    const kind = sessionStorage.getItem("ssims-flash-kind") || "ok";
    sessionStorage.removeItem("ssims-flash");
    sessionStorage.removeItem("ssims-flash-kind");
    return text ? { text, kind } : null;
  },
};
