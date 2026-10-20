const STAFF_ROLES = ["admin", "registrar"];

const SsimsAuth = {
  user() {
    return SsimsStore.getSession();
  },

  isStaff(user) {
    return Boolean(user && STAFF_ROLES.includes(user.role));
  },

  isStudent(user) {
    return Boolean(user && user.role === "student");
  },

  home() {
    return "app.html";
  },

  requireUser() {
    const user = this.user();
    if (!user) {
      location.href = "login.html";
      return null;
    }
    return user;
  },

  signIn(email, password) {
    const data = SsimsStore.load();
    const user = data.users.find(
      (item) => item.email.toLowerCase() === String(email).trim().toLowerCase() && item.status === "active",
    );
    if (!user || user.password !== password) {
      return { ok: false, error: "Email or password is incorrect." };
    }
    SsimsStore.setSession(user.id);
    return { ok: true, user };
  },

  signOut() {
    SsimsStore.clearSession();
    location.href = "index.html";
  },
};
