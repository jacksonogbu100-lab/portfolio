(() => {
  const form = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");
  if (!form) return;

  const existing = SsimsAuth.user();
  if (existing) {
    location.href = SsimsAuth.home();
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value;
    const password = form.password.value;
    const result = SsimsAuth.signIn(email, password);
    if (!result.ok) {
      errorBox.hidden = false;
      errorBox.textContent = result.error;
      return;
    }
    location.href = SsimsAuth.home();
  });
})();
