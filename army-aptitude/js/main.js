const TOTAL_SECONDS = 40 * 60;
const questions = window.NAAPT_QUESTIONS || [];

const state = {
  candidate: null,
  index: 0,
  answers: Array(questions.length).fill(null),
  remaining: TOTAL_SECONDS,
  timerId: null,
  started: false,
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function showScreen(id) {
  $$(".screen").forEach((s) => s.classList.toggle("active", s.id === `screen-${id}`));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer() {
  stopTimer();
  state.remaining = TOTAL_SECONDS;
  updateTimerUI();
  state.timerId = setInterval(() => {
    state.remaining -= 1;
    updateTimerUI();
    if (state.remaining <= 0) {
      stopTimer();
      finishTest(true);
    }
  }, 1000);
}

function updateTimerUI() {
  const el = $("#timer");
  el.textContent = formatTime(Math.max(0, state.remaining));
  el.classList.toggle("warn", state.remaining <= 5 * 60);
}

function renderQuestionMap() {
  $("#q-grid").innerHTML = questions
    .map((_, i) => {
      const classes = ["q-dot"];
      if (state.answers[i] !== null) classes.push("answered");
      if (i === state.index) classes.push("current");
      return `<button type="button" class="${classes.join(" ")}" data-jump="${i}">${i + 1}</button>`;
    })
    .join("");
}

function renderQuestion() {
  const q = questions[state.index];
  if (!q) return;

  $("#section-label").textContent = q.section;
  $("#q-section-tag").textContent = q.section;
  $("#progress-label").textContent = `Question ${state.index + 1} of ${questions.length}`;
  $("#q-text").textContent = q.q;

  $("#q-options").innerHTML = q.options
    .map((opt, i) => {
      const selected = state.answers[state.index] === i ? "selected" : "";
      return `<button type="button" class="option ${selected}" data-opt="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>`;
    })
    .join("");

  $("#btn-prev").disabled = state.index === 0;
  $("#btn-next").textContent = state.index === questions.length - 1 ? "Review & submit" : "Next";
  renderQuestionMap();
}

function selectAnswer(optIndex) {
  state.answers[state.index] = optIndex;
  renderQuestion();
}

function goTo(index) {
  state.index = Math.max(0, Math.min(questions.length - 1, index));
  renderQuestion();
}

function startTest() {
  state.index = 0;
  state.answers = Array(questions.length).fill(null);
  state.started = true;
  showScreen("test");
  renderQuestion();
  startTimer();
}

function scoreTest() {
  const bySection = {};
  let correct = 0;

  questions.forEach((q, i) => {
    if (!bySection[q.section]) bySection[q.section] = { correct: 0, total: 0 };
    bySection[q.section].total += 1;
    const ok = state.answers[i] === q.answer;
    if (ok) {
      correct += 1;
      bySection[q.section].correct += 1;
    }
  });

  return {
    correct,
    total: questions.length,
    percent: Math.round((correct / questions.length) * 100),
    bySection,
  };
}

function finishTest(auto = false) {
  stopTimer();
  state.started = false;
  const result = scoreTest();
  const c = state.candidate;

  $("#result-title").textContent = auto ? "Time is up — assessment submitted" : "Assessment complete";
  $("#result-sub").textContent = `${c.name} · ${c.form} · ${c.state}${c.corps ? " · " + c.corps : ""}`;
  $("#score-big").textContent = `${result.percent}%`;
  $("#score-meta").innerHTML = `
    <div><strong>${result.correct}</strong> / ${result.total} correct</div>
    <div>Time used: ${formatTime(TOTAL_SECONDS - Math.max(0, state.remaining))}</div>
    <div>${result.percent >= 70 ? "Strong practice result" : result.percent >= 50 ? "Fair — keep practising" : "Needs more preparation"}</div>
  `;

  $("#section-scores").innerHTML = Object.entries(result.bySection)
    .map(
      ([name, s]) => `
      <div class="section-card">
        <span>${name}</span>
        <strong>${s.correct}/${s.total}</strong>
      </div>`,
    )
    .join("");

  $("#review-list").innerHTML = questions
    .map((q, i) => {
      const chosen = state.answers[i];
      const ok = chosen === q.answer;
      const chosenText = chosen === null ? "No answer" : q.options[chosen];
      return `
        <div class="review-item ${ok ? "correct" : "wrong"}">
          <div class="q">${i + 1}. ${q.q}</div>
          <div class="a">Your answer: ${chosenText}${ok ? " ✓" : ` ✗ · Correct: ${q.options[q.answer]}`}</div>
        </div>`;
    })
    .join("");

  showScreen("results");
}

function resetAll() {
  stopTimer();
  state.candidate = null;
  state.index = 0;
  state.answers = Array(questions.length).fill(null);
  state.remaining = TOTAL_SECONDS;
  state.started = false;
  $("#candidate-form").reset();
}

function bind() {
  $("#btn-start-flow").addEventListener("click", () => showScreen("form"));
  $("#btn-how-it-works").addEventListener("click", () => {
    $("#how-it-works").scrollIntoView({ behavior: "smooth" });
  });

  $$("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.dataset.go));
  });

  $("#candidate-form").addEventListener("submit", (e) => {
    e.preventDefault();
    state.candidate = {
      name: $("#c-name").value.trim(),
      form: $("#c-form").value.trim(),
      state: $("#c-state").value.trim(),
      corps: $("#c-corps").value,
    };
    $("#brief-candidate").textContent = `${state.candidate.name} · ${state.candidate.form} · ${state.candidate.state}`;
    showScreen("brief");
  });

  $("#btn-start-test").addEventListener("click", startTest);

  $("#btn-prev").addEventListener("click", () => goTo(state.index - 1));
  $("#btn-next").addEventListener("click", () => {
    if (state.index === questions.length - 1) {
      if (confirm("Submit your aptitude test now?")) finishTest(false);
    } else {
      goTo(state.index + 1);
    }
  });

  $("#q-options").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-opt]");
    if (btn) selectAnswer(Number(btn.dataset.opt));
  });

  $("#q-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-jump]");
    if (btn) goTo(Number(btn.dataset.jump));
  });

  $("#btn-submit-test").addEventListener("click", () => {
    const unanswered = state.answers.filter((a) => a === null).length;
    const msg =
      unanswered > 0
        ? `You have ${unanswered} unanswered question(s). Submit anyway?`
        : "Submit your aptitude test now?";
    if (confirm(msg)) finishTest(false);
  });

  $("#btn-retake").addEventListener("click", () => {
    if (!state.candidate) {
      showScreen("form");
      return;
    }
    $("#brief-candidate").textContent = `${state.candidate.name} · ${state.candidate.form} · ${state.candidate.state}`;
    showScreen("brief");
  });

  $("#btn-home").addEventListener("click", () => {
    resetAll();
    showScreen("landing");
  });

  window.addEventListener("beforeunload", (e) => {
    if (state.started) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

bind();
