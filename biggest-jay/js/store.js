window.BJStore = (function () {
  const KEY = "biggest-jay-v2";
  const SESSION = "biggest-jay-session";
  const PENDING = "biggest-jay-pending";

  function uid(prefix) {
    return prefix + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function freshAccount(username) {
    let number = "";
    for (let i = 0; i < 10; i += 1) number += Math.floor(Math.random() * 10);
    return {
      bank: "JayPay",
      number,
      name: "Biggest Jay · " + username,
      charge: 50,
    };
  }

  function empty(user) {
    return {
      user,
      wallet: { balance: 0, bonus: 0, totalFunding: 0, totalSpent: 0 },
      account: freshAccount(user.username),
      transactions: [],
      referrals: [],
      batches: [],
      apiKey: "bj_test_" + Math.random().toString(36).slice(2, 12),
      settings: { smsAlerts: true },
    };
  }

  function makeTx(partial) {
    return {
      id: uid("BJ"),
      status: "success",
      at: new Date().toISOString(),
      ...partial,
    };
  }

  function post(db, row) {
    if (row.direction === "credit") {
      db.wallet.balance += row.amount;
      if (row.funding) db.wallet.totalFunding += row.amount;
    } else {
      db.wallet.balance -= row.amount;
      db.wallet.totalSpent += row.amount;
    }
    db.transactions.unshift(row);
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const db = JSON.parse(raw);
      if (!db.user || !db.wallet) return null;
      return db;
    } catch (err) {
      return null;
    }
  }

  function save(db) {
    localStorage.setItem(KEY, JSON.stringify(db));
  }

  function reject(error) {
    return { ok: false, error };
  }

  function needAccount() {
    const db = load();
    if (!db) return null;
    return db;
  }

  function commitDebit(db, amount, partial) {
    const value = Math.round(Number(amount));
    if (!value || value < 1) return reject("Enter a valid amount.");
    if (db.wallet.balance < value) {
      return reject("Wallet balance is not enough. Fund the wallet and try again.");
    }
    const row = makeTx({ ...partial, amount: value, direction: "debit" });
    post(db, row);
    save(db);
    return { ok: true, db, tx: row };
  }

  function commitCredit(db, amount, partial) {
    const value = Math.round(Number(amount));
    if (!value || value < 1) return reject("Enter a valid amount.");
    const row = makeTx({ ...partial, amount: value, direction: "credit" });
    post(db, row);
    save(db);
    return { ok: true, db, tx: row };
  }

  return {
    get() {
      return needAccount();
    },
    hasAccount() {
      return !!needAccount();
    },
    session() {
      return sessionStorage.getItem(SESSION) === "1" && !!needAccount();
    },
    signOut() {
      sessionStorage.removeItem(SESSION);
    },
    signIn(username, password) {
      const db = needAccount();
      if (!db) {
        return reject("No account on this browser yet. Create one first.");
      }
      const name = String(username || "").trim().toLowerCase();
      if (name !== db.user.username.toLowerCase() || password !== db.user.password) {
        return reject("Those details do not match this browser's Biggest Jay account.");
      }
      sessionStorage.setItem(SESSION, "1");
      return { ok: true, db };
    },
    register(input) {
      const username = String(input.username || "").trim();
      const name = String(input.name || "").trim();
      const password = String(input.password || "");
      if (!/^[a-zA-Z0-9._]{3,20}$/.test(username)) {
        return reject("Username needs 3 to 20 letters, numbers, dots, or underscores.");
      }
      if (name.length < 2) return reject("Enter the name customers should see.");
      if (password.length < 4) return reject("Use at least 4 characters for the password.");
      const user = {
        name,
        username,
        password,
        email: username.toLowerCase() + "@biggestjay.demo",
        phone: "",
        package: "smart",
        referral: username.toUpperCase().slice(0, 10),
        joined: new Date().toISOString(),
      };
      const db = empty(user);
      save(db);
      sessionStorage.setItem(SESSION, "1");
      return { ok: true, db };
    },
    reset() {
      localStorage.removeItem(KEY);
      localStorage.removeItem("biggest-jay-v1");
      sessionStorage.removeItem(SESSION);
      sessionStorage.removeItem(PENDING);
      return null;
    },
    saveProfile(patch) {
      const db = needAccount();
      if (!db) return reject("No account on this browser.");
      db.user.name = String(patch.name || "").trim() || db.user.name;
      db.user.email = String(patch.email || "").trim() || db.user.email;
      db.user.phone = String(patch.phone || "").trim();
      db.account.name = "Biggest Jay · " + db.user.username;
      save(db);
      return { ok: true, db };
    },
    changePassword(current, next, confirm) {
      const db = needAccount();
      if (!db) return reject("No account on this browser.");
      if (current !== db.user.password) return reject("Current password is wrong.");
      if (!next || next.length < 4) return reject("Use at least 4 characters for the new password.");
      if (next !== confirm) return reject("New password and confirmation do not match.");
      db.user.password = next;
      save(db);
      return { ok: true, db };
    },
    setPackage(id) {
      const db = needAccount();
      if (!db) return null;
      db.user.package = id;
      save(db);
      return db;
    },
    setSetting(key, value) {
      const db = needAccount();
      if (!db) return null;
      db.settings[key] = value;
      save(db);
      return db;
    },
    rotateKey() {
      const db = needAccount();
      if (!db) return null;
      db.apiKey = "bj_test_" + Math.random().toString(36).slice(2, 12);
      save(db);
      return db;
    },
    debit(amount, partial) {
      const db = needAccount();
      if (!db) return reject("No account on this browser.");
      return commitDebit(db, amount, partial);
    },
    credit(amount, partial) {
      const db = needAccount();
      if (!db) return reject("No account on this browser.");
      return commitCredit(db, amount, partial);
    },
    addBatch(batch) {
      const db = needAccount();
      if (!db) return null;
      db.batches.unshift(batch);
      save(db);
      return db;
    },
    convertBonus() {
      const db = needAccount();
      if (!db) return reject("No account on this browser.");
      if (db.wallet.bonus < 1) return reject("There is no bonus to move.");
      const amount = db.wallet.bonus;
      db.wallet.bonus = 0;
      const row = makeTx({
        type: "transfer",
        title: "Bonus to wallet",
        detail: "Referral bonus",
        amount,
        direction: "credit",
        funding: false,
      });
      post(db, row);
      save(db);
      return { ok: true, db, tx: row };
    },
    setPending(payload) {
      sessionStorage.setItem(PENDING, JSON.stringify(payload));
    },
    pending() {
      try {
        return JSON.parse(sessionStorage.getItem(PENDING) || "null");
      } catch (err) {
        return null;
      }
    },
    clearPending() {
      sessionStorage.removeItem(PENDING);
    },
  };
})();
