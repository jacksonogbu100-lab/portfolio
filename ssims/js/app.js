(() => {
  const user = SsimsAuth.requireUser();
  if (!user) return;

  const content = document.getElementById("content");
  const sidebar = document.getElementById("sidebar");
  const drawer = document.getElementById("drawer");
  const drawerPanel = document.getElementById("drawer-panel");
  const bell = document.getElementById("bell");
  const bellBadge = document.getElementById("bell-badge");
  const userChip = document.getElementById("user-chip");
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const menuBtn = document.getElementById("menu-btn");

  const staff = SsimsAuth.isStaff(user);
  userAvatar.textContent = SsimsUi.initials(user.name);
  userName.textContent = user.name;

  function data() {
    return SsimsStore.load();
  }

  function save(next) {
    SsimsStore.save(next);
  }

  function studentOf(record) {
    return data().students.find((item) => item.id === record) || null;
  }

  function scopedStudent() {
    if (staff) return null;
    return SsimsStore.studentForUser(user);
  }

  function canSeeStudent(studentId) {
    if (staff) return true;
    const mine = scopedStudent();
    return Boolean(mine && mine.id === studentId);
  }

  function unreadCount() {
    return data().notifications.filter((item) => item.userId === user.id && !item.read).length;
  }

  function refreshBell() {
    const count = unreadCount();
    bellBadge.hidden = count === 0;
    bellBadge.textContent = String(count);
  }

  function navItems() {
    const items = [
      { href: "#/", key: "home", label: "Dashboard", icon: "dashboard" },
      { href: staff ? "#/students" : "#/records", key: "records", label: "Student Records", icon: "records" },
      { href: "#/academic", key: "academic", label: "Academic Information", icon: "academic" },
      { href: "#/payments", key: "payments", label: "Payments", icon: "payments" },
      { href: "#/documents", key: "documents", label: "Documents", icon: "documents" },
      { href: "#/requests", key: "requests", label: "Requests", icon: "requests" },
      { href: "#/messages", key: "messages", label: "Messages", icon: "messages" },
      { href: "#/settings", key: "settings", label: "Settings", icon: "settings" },
    ];
    return items;
  }

  function activeKey(path) {
    if (path.startsWith("/students") || path === "/records") return "records";
    if (path.startsWith("/academic")) return "academic";
    if (path.startsWith("/payments")) return "payments";
    if (path.startsWith("/documents")) return "documents";
    if (path.startsWith("/requests")) return "requests";
    if (path.startsWith("/messages")) return "messages";
    if (path.startsWith("/settings")) return "settings";
    return "home";
  }

  function navMarkup(current) {
    const links = navItems()
      .map((item) => {
        const active = item.key === current ? " active" : "";
        return `<a class="nav-link${active}" href="${item.href}">${SsimsUi.icon(item.icon)}<span>${item.label}</span></a>`;
      })
      .join("");
    return `
      <a class="sidebar-brand" href="#/">
        <span class="brand-icon">${SsimsUi.icon("cap")}</span>
        <span>
          <strong>SSIMS</strong>
          <small>NACEST · Secure Student Information Management System</small>
        </span>
      </a>
      <nav class="nav-list">${links}</nav>
      <div class="sidebar-footer">
        <p class="tagline">Secure • Reliable • For a Brighter Future</p>
        <button class="btn logout-btn" type="button" data-action="logout">${SsimsUi.icon("logout")} Logout</button>
      </div>
    `;
  }

  function paintNav(path) {
    const markup = navMarkup(activeKey(path));
    sidebar.innerHTML = markup;
    drawerPanel.innerHTML = markup;
    refreshBell();
  }

  function flashHtml() {
    const flash = SsimsUi.takeFlash();
    if (!flash) return "";
    return `<div class="alert alert-${flash.kind === "ok" ? "ok" : "danger"} flash">${SsimsUi.escape(flash.text)}</div>`;
  }

  function denied() {
    content.innerHTML = `${flashHtml()}<div class="card">${SsimsUi.empty("Permission denied", "You cannot open this record.")}</div>`;
  }

  function route() {
    const hash = location.hash || "#/";
    const [path, queryString] = hash.replace(/^#/, "").split("?");
    const query = new URLSearchParams(queryString || "");
    const parts = path.split("/").filter(Boolean);
    paintNav("/" + parts.join("/"));
    searchInput.value = query.get("q") || "";

    if (!parts.length) return renderDashboard(query);
    if (parts[0] === "records") return renderRecords();
    if (parts[0] === "students" && parts[1]) return renderStudent(parts[1]);
    if (parts[0] === "students") return renderStudents(query);
    if (parts[0] === "academic") return renderAcademic();
    if (parts[0] === "payments") return renderPayments();
    if (parts[0] === "documents") return renderDocuments();
    if (parts[0] === "requests") return renderRequests();
    if (parts[0] === "messages") return renderMessages();
    if (parts[0] === "settings") return renderSettings();
    content.innerHTML = `<div class="card">${SsimsUi.empty("Not found", "That screen is not in SSIMS.")}</div>`;
  }

  function firstName(name) {
    return String(name || "").split(" ")[0] || "there";
  }

  function welcomeArt() {
    return `<svg class="welcome-art" viewBox="0 0 180 120" aria-hidden="true">
      <ellipse cx="118" cy="108" rx="46" ry="8" fill="#d5e4ff"/>
      <rect x="22" y="58" width="78" height="48" rx="8" fill="#cfe0ff"/>
      <rect x="32" y="68" width="58" height="28" rx="4" fill="#fff"/>
      <rect x="38" y="74" width="28" height="4" rx="2" fill="#bed3f7"/>
      <rect x="38" y="82" width="20" height="4" rx="2" fill="#bed3f7"/>
      <circle cx="126" cy="46" r="16" fill="#f3c7b0"/>
      <path d="M112 42c4-14 24-14 28 0" fill="#2b241c"/>
      <rect x="112" y="62" width="28" height="34" rx="10" fill="#2f7bff"/>
      <path d="M108 96h36" stroke="#152a4a" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }

  function renderDashboard(query) {
    if (staff) return renderStaffHome(query);
    const student = scopedStudent();
    if (!student) return denied();
    const store = data();
    const outstanding = SsimsStore.outstandingFees(student.id);
    const activities = store.activities.filter((item) => item.studentId === student.id);
    const q = (query.get("q") || "").toLowerCase();
    const filtered = q
      ? activities.filter((item) => item.activity.toLowerCase().includes(q) || item.status.toLowerCase().includes(q))
      : activities;
    content.innerHTML = `
      ${flashHtml()}
      <div class="dash-layout">
        <div>
          <section class="welcome">
            <div>
              <h1>Welcome back, ${SsimsUi.escape(firstName(student.displayName))}!</h1>
              <p>Here's an overview of your academic profile.</p>
            </div>
            ${welcomeArt()}
          </section>
          <section class="stat-grid">
            ${statCard("level", "tone-green", "Current Level", `${student.level} ${student.mode}`, "")}
            ${statCard("cgpa", "tone-blue", "CGPA", student.cgpa.toFixed(2), `<a class="link" href="#/academic">View Details</a>`)}
            ${statCard("session", "tone-orange", "Academic Session", student.session, student.sessionStatus)}
            ${statCard("fees", "tone-red", "Outstanding Fees", SsimsStore.formatNaira(outstanding), outstanding ? "Balance due" : "All cleared")}
          </section>
          <section class="card">
            <div class="card-head">
              <h2>Recent Activities</h2>
              <a class="link" href="#/messages">View All</a>
            </div>
            ${activityTable(filtered)}
          </section>
        </div>
        <aside class="dash-rail">
          ${profileCard(student, true)}
          <section class="card">
            <div class="card-head"><h2>Quick Actions</h2></div>
            <div class="action-grid">
              <a class="action-tile tone-blue" href="#/academic">${SsimsUi.icon("results")} View Results</a>
              <a class="action-tile tone-green" href="#/academic">${SsimsUi.icon("register")} Register Courses</a>
              <a class="action-tile tone-purple" href="#/payments">${SsimsUi.icon("pay")} Make Payment</a>
              <a class="action-tile tone-red" href="#/documents">${SsimsUi.icon("upload")} Upload Document</a>
              <a class="action-tile tone-orange" href="#/requests">${SsimsUi.icon("letter")} Request Letter</a>
              <a class="action-tile tone-blue" href="#/academic">${SsimsUi.icon("timetable")} View Timetable</a>
            </div>
          </section>
          <section class="card">
            <div class="card-head">
              <h2>Important Notice</h2>
              <a class="link" href="#/messages">View All</a>
            </div>
            <ul class="notice-list">
              ${store.notices
                .map(
                  (item) => `<li><time>${SsimsUi.formatDate(item.date)}</time><strong>${SsimsUi.escape(item.title)}</strong><p class="muted">${SsimsUi.escape(item.body)}</p></li>`,
                )
                .join("")}
            </ul>
          </section>
        </aside>
      </div>
    `;
  }

  function statCard(icon, tone, label, value, extra) {
    return `<article class="card stat-card">
      <span class="stat-icon ${tone}">${SsimsUi.icon(icon)}</span>
      <div>
        <small>${label}</small>
        <h2>${SsimsUi.escape(String(value))}</h2>
        <p>${extra}</p>
      </div>
    </article>`;
  }

  function activityTable(rows) {
    if (!rows.length) return SsimsUi.empty("No activities", "Nothing matches this search yet.");
    return `<div class="table-wrap"><table class="data-table">
      <thead><tr><th>Date</th><th>Activity</th><th>Status</th></tr></thead>
      <tbody>
        ${rows
          .map(
            (item) => `<tr>
              <td>${SsimsUi.formatDate(item.date)}</td>
              <td>${SsimsUi.escape(item.activity)}</td>
              <td><span class="badge ${SsimsUi.statusClass(item.status)}">${SsimsUi.escape(item.status)}</span></td>
            </tr>`,
          )
          .join("")}
      </tbody>
    </table></div>`;
  }

  function profileCard(student, editable) {
    return `<section class="card profile-card">
      <div class="card-head">
        <h2>My Profile</h2>
        ${editable ? `<a class="link" href="#/records">${SsimsUi.icon("edit")} Edit</a>` : ""}
      </div>
      ${SsimsUi.avatar(student.displayName, "avatar-lg")}
      <h2>${SsimsUi.escape(student.displayName)}</h2>
      <p class="muted">${SsimsUi.escape(student.matricNo)}</p>
      <div class="meta-list">
        <span>${SsimsUi.icon("academic")} ${SsimsUi.escape(student.department)}</span>
        <span>${SsimsUi.icon("records")} Faculty of ${SsimsUi.escape(student.faculty)}</span>
        <span>${SsimsUi.icon("mail")} ${SsimsUi.escape(student.email)}</span>
        <span>${SsimsUi.icon("phone")} ${SsimsUi.escape(student.phone)}</span>
      </div>
    </section>`;
  }

  function renderStaffHome(query) {
    const store = data();
    const q = (query.get("q") || "").toLowerCase();
    const students = store.students.filter((item) => {
      if (!q) return true;
      return [item.displayName, item.matricNo, item.department, item.email].join(" ").toLowerCase().includes(q);
    });
    const due = store.payments.filter((item) => item.status === "due").length;
    const pending = store.requests.filter((item) => item.status === "pending").length;
    content.innerHTML = `
      ${flashHtml()}
      <section class="welcome">
        <div>
          <h1>Welcome back, ${SsimsUi.escape(firstName(user.name))}!</h1>
          <p>Manage student records, fees, documents, and requests from this desk.</p>
        </div>
        ${welcomeArt()}
      </section>
      <section class="stat-grid">
        ${statCard("records", "tone-blue", "Students", store.students.length, `<a class="link" href="#/students">Open directory</a>`)}
        ${statCard("fees", "tone-red", "Fees due", due, "Awaiting payment")}
        ${statCard("requests", "tone-orange", "Open requests", pending, `<a class="link" href="#/requests">Review</a>`)}
        ${statCard("documents", "tone-green", "Documents", store.documents.length, `<a class="link" href="#/documents">Review</a>`)}
      </section>
      <section class="card">
        <div class="card-head">
          <h2>Student Records</h2>
          <a class="link" href="#/students">View All</a>
        </div>
        ${studentTable(students)}
      </section>
    `;
  }

  function studentTable(rows) {
    if (!rows.length) return SsimsUi.empty("No students", "No student records match this search.");
    return `<table class="data-table">
      <thead><tr><th>Name</th><th>Matric No</th><th>Level</th><th>CGPA</th><th>Fees</th></tr></thead>
      <tbody>
        ${rows
          .map((item) => {
            const due = SsimsStore.outstandingFees(item.id);
            return `<tr>
              <td><a class="link" href="#/students/${item.id}">${SsimsUi.escape(item.displayName)}</a></td>
              <td>${SsimsUi.escape(item.matricNo)}</td>
              <td>${SsimsUi.escape(item.level)}</td>
              <td>${item.cgpa.toFixed(2)}</td>
              <td>${due ? SsimsStore.formatNaira(due) : "Cleared"}</td>
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>`;
  }

  function renderStudents(query) {
    if (!staff) {
      location.hash = "#/records";
      return;
    }
    const q = (query.get("q") || "").toLowerCase();
    const rows = data().students.filter((item) => {
      if (!q) return true;
      return [item.displayName, item.matricNo, item.department, item.email].join(" ").toLowerCase().includes(q);
    });
    content.innerHTML = `
      ${flashHtml()}
      <div class="page-head">
        <div>
          <p class="card-kicker">Directory</p>
          <h1>Student Records</h1>
        </div>
      </div>
      <section class="card">${studentTable(rows)}</section>
    `;
  }

  function renderStudent(id) {
    if (!staff) {
      location.hash = "#/records";
      return;
    }
    const student = studentOf(id);
    if (!student) {
      content.innerHTML = `<div class="card">${SsimsUi.empty("Not found", "That student file is not in SSIMS.")}</div>`;
      return;
    }
    content.innerHTML = studentFile(student, false);
  }

  function renderRecords() {
    const student = scopedStudent();
    if (!student) {
      if (staff) {
        location.hash = "#/students";
        return;
      }
      return denied();
    }
    content.innerHTML = studentFile(student, true);
  }

  function collegeFile(student) {
    const rows = [
      ["Full name", student.displayName],
      ["Matric No", student.matricNo],
      ["Programme", student.programme],
      ["Department", student.department],
      ["Faculty", `Faculty of ${student.faculty}`],
      ["Level", `${student.level} ${student.mode}`],
      ["Session", `${student.session} · ${student.sessionStatus}`],
      ["Gender", student.gender],
      ["Date of birth", SsimsUi.formatDate(student.dateOfBirth)],
      ["Email", student.email],
    ];
    return `<dl class="record-dl">${rows
      .map((row) => `<dt>${SsimsUi.escape(row[0])}</dt><dd>${SsimsUi.escape(row[1])}</dd>`)
      .join("")}</dl>`;
  }

  function studentFile(student, editable) {
    const contactForm = `<form class="form-grid" data-form="profile" data-student="${student.id}">
      <p class="locked-note full">NACEST college fields cannot be changed here. Update phone, address, and state only.</p>
      <label>Phone<input name="phone" value="${SsimsUi.escape(student.phone)}" required autocomplete="tel" /></label>
      <label>State<input name="state" value="${SsimsUi.escape(student.state)}" required /></label>
      <label class="full">Address<input name="address" value="${SsimsUi.escape(student.address)}" required autocomplete="street-address" /></label>
      <div class="full"><button class="btn btn-primary" type="submit">Save contact details</button></div>
    </form>`;
    const contactRead = `<div class="meta-list">
      <span>${SsimsUi.icon("phone")} ${SsimsUi.escape(student.phone)}</span>
      <span>${SsimsUi.icon("records")} ${SsimsUi.escape(student.address)}</span>
      <span>${SsimsUi.icon("academic")} ${SsimsUi.escape(student.state)}</span>
    </div>`;
    return `
      ${flashHtml()}
      <div class="page-head">
        <div>
          <p class="card-kicker">NACEST student file</p>
          <h1>Student Records</h1>
        </div>
      </div>
      <div class="dash-layout">
        ${profileCard(student, false)}
        <div class="dash-rail">
          <section class="card">
            <div class="card-head"><h2>College biodata</h2></div>
            <p class="locked-note">Held by the records desk. Students cannot edit these fields.</p>
            ${collegeFile(student)}
          </section>
          <section class="card">
            <div class="card-head"><h2>Contact details</h2></div>
            ${editable ? contactForm : contactRead}
          </section>
        </div>
      </div>
    `;
  }

  function visibleStudents() {
    const mine = scopedStudent();
    return staff ? data().students : mine ? [mine] : [];
  }

  function renderAcademic() {
    if (staff) {
      content.innerHTML = `
        ${flashHtml()}
        <div class="page-head"><div><p class="card-kicker">NACEST academics</p><h1>Academic Information</h1></div></div>
        <section class="card">${SsimsUi.empty("Student view only in this phase", "Sign in as a student to see registered courses, results, the timetable, and course registration.")}</section>
      `;
      return;
    }
    const student = scopedStudent();
    if (!student) return denied();
    const store = data();
    const enrolled = store.enrollments.filter((item) => item.studentId === student.id);
    const results = store.results.filter((item) => item.studentId === student.id);
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const slots = store.timetable
      .filter((item) => enrolled.some((row) => row.courseId === item.courseId))
      .sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.start.localeCompare(b.start));
    const remaining = store.courses.filter(
      (course) => course.level === student.level && !enrolled.some((row) => row.courseId === course.id),
    );
    content.innerHTML = `
      ${flashHtml()}
      <div class="page-head">
        <div>
          <p class="card-kicker">NACEST academics · ${SsimsUi.escape(student.matricNo)}</p>
          <h1>Academic Information</h1>
        </div>
        <span class="badge info">CGPA ${student.cgpa.toFixed(2)}</span>
      </div>
      <div class="stack">
        <section class="card">
          <div class="card-head"><h2>Registered courses</h2></div>
          ${
            enrolled.length
              ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Code</th><th>Title</th><th>Units</th><th>Semester</th></tr></thead><tbody>${enrolled
                  .map((item) => {
                    const course = SsimsStore.courseById(item.courseId);
                    return `<tr><td>${SsimsUi.escape(course?.code)}</td><td>${SsimsUi.escape(course?.title)}</td><td>${course?.units || ""}</td><td>${SsimsUi.escape(course?.semester)}</td></tr>`;
                  })
                  .join("")}</tbody></table></div>`
              : SsimsUi.empty("No courses", "Register a course below.")
          }
        </section>
        <section class="card">
          <div class="card-head"><h2>Course registration</h2></div>
          ${
            remaining.length
              ? `<p class="locked-note">Add a remaining ${SsimsUi.escape(student.level)}-level course for ${SsimsUi.escape(student.session)}.</p>
                <form class="form-grid" data-form="register" data-student="${student.id}">
                  <label class="full">Course
                    <select name="courseId">${remaining
                      .map((course) => `<option value="${course.id}">${SsimsUi.escape(course.code)} — ${SsimsUi.escape(course.title)} (${course.units} units)</option>`)
                      .join("")}</select>
                  </label>
                  <div class="full"><button class="btn btn-primary" type="submit">Register course</button></div>
                </form>`
              : SsimsUi.empty("Registration complete", "There are no remaining courses at this level.")
          }
        </section>
        <section class="card">
          <div class="card-head"><h2>Results</h2></div>
          ${
            results.length
              ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Course</th><th>Title</th><th>Score</th><th>Grade</th></tr></thead><tbody>${results
                  .map((item) => {
                    const course = SsimsStore.courseById(item.courseId);
                    return `<tr><td>${SsimsUi.escape(course?.code)}</td><td>${SsimsUi.escape(course?.title)}</td><td>${item.score}</td><td><span class="badge info">${SsimsUi.escape(item.grade)}</span></td></tr>`;
                  })
                  .join("")}</tbody></table></div>`
              : SsimsUi.empty("No results", "Published scores will appear here.")
          }
        </section>
        <section class="card">
          <div class="card-head"><h2>Timetable</h2></div>
          ${
            slots.length
              ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Day</th><th>Course</th><th>Time</th><th>Room</th></tr></thead><tbody>${slots
                  .map((item) => {
                    const course = SsimsStore.courseById(item.courseId);
                    return `<tr><td>${SsimsUi.escape(item.day)}</td><td>${SsimsUi.escape(course?.code)}</td><td>${SsimsUi.escape(item.start)}–${SsimsUi.escape(item.end)}</td><td>${SsimsUi.escape(item.room)}</td></tr>`;
                  })
                  .join("")}</tbody></table></div>`
              : SsimsUi.empty("No timetable", "Registered courses will show class times.")
          }
        </section>
      </div>
    `;
  }

  function renderPayments() {
    if (staff) {
      content.innerHTML = `
        ${flashHtml()}
        <div class="page-head"><div><p class="card-kicker">NACEST fees</p><h1>Payments</h1></div></div>
        <section class="card">${SsimsUi.empty("Student view only in this phase", "Sign in as a student to see fees in naira and record a demo payment.")}</section>
      `;
      return;
    }
    const student = scopedStudent();
    if (!student) return denied();
    const rows = data().payments.filter((item) => item.studentId === student.id);
    const due = rows.filter((item) => item.status === "due");
    const outstanding = SsimsStore.outstandingFees(student.id);
    content.innerHTML = `
      ${flashHtml()}
      <div class="page-head">
        <div>
          <p class="card-kicker">NACEST fees · ${SsimsUi.escape(student.matricNo)}</p>
          <h1>Payments</h1>
        </div>
        <span class="badge ${outstanding ? "warn" : "ok"}">${outstanding ? `Due ${SsimsStore.formatNaira(outstanding)}` : "All cleared"}</span>
      </div>
      <div class="stack">
        <section class="card">
          <div class="card-head"><h2>Record a demo payment</h2></div>
          ${
            due.length
              ? `<p class="locked-note">This records a payment in the browser only. No live card charge is taken.</p>
                <form class="form-grid" data-form="pay" data-student="${student.id}">
                  <label class="full">Outstanding item
                    <select name="paymentId">${due
                      .map((item) => `<option value="${item.id}">${SsimsUi.escape(item.title)} — ${SsimsStore.formatNaira(item.amount)}</option>`)
                      .join("")}</select>
                  </label>
                  <label>Method
                    <select name="method">
                      <option>Bank transfer</option>
                      <option>Cash</option>
                    </select>
                  </label>
                  <div class="full"><button class="btn btn-primary" type="submit">Record payment</button></div>
                </form>`
              : SsimsUi.empty("Nothing due", "There is no outstanding fee to pay.")
          }
        </section>
        <section class="card">
          <div class="card-head"><h2>Fee history</h2></div>
          ${
            rows.length
              ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Reference</th><th>Title</th><th>Amount</th><th>Due</th><th>Status</th></tr></thead><tbody>${rows
                  .map(
                    (item) => `<tr>
                      <td>${SsimsUi.escape(item.reference)}</td>
                      <td>${SsimsUi.escape(item.title)}</td>
                      <td>${SsimsStore.formatNaira(item.amount)}</td>
                      <td>${SsimsUi.formatDate(item.dueDate)}</td>
                      <td><span class="badge ${SsimsUi.statusClass(item.status)}">${SsimsUi.escape(item.status)}</span></td>
                    </tr>`,
                  )
                  .join("")}</tbody></table></div>`
              : SsimsUi.empty("No payments", "Fee records will appear here.")
          }
        </section>
      </div>
    `;
  }

  function documentRows(rows, { showStudent, canVerify }) {
    if (!rows.length) return SsimsUi.empty("No documents", "Filed records will appear here.");
    const studentHead = showStudent ? "<th>Student</th>" : "";
    const actionHead = canVerify ? "<th></th>" : "";
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Title</th><th>Kind</th>${studentHead}<th>Filed</th><th>Status</th>${actionHead}</tr></thead><tbody>${rows
      .map((item) => {
        const owner = studentOf(item.studentId);
        const studentCell = showStudent ? `<td>${SsimsUi.escape(owner?.displayName)}</td>` : "";
        const actionCell = canVerify
          ? `<td>${
              item.status !== "verified"
                ? `<button class="btn btn-sm" type="button" data-action="verify-doc" data-id="${SsimsUi.escape(item.id)}">Verify</button>`
                : ""
            }</td>`
          : "";
        return `<tr>
          <td>${SsimsUi.escape(item.title)}</td>
          <td>${SsimsUi.escape(item.kind)}</td>
          ${studentCell}
          <td>${SsimsUi.formatDate(item.uploadedAt)}</td>
          <td><span class="badge ${SsimsUi.statusClass(item.status)}">${SsimsUi.escape(item.status)}</span></td>
          ${actionCell}
        </tr>`;
      })
      .join("")}</tbody></table></div>`;
  }

  function renderDocuments() {
    if (staff) {
      const rows = data().documents;
      const pending = rows.filter((item) => item.status === "pending").length;
      content.innerHTML = `
        ${flashHtml()}
        <div class="page-head">
          <div>
            <p class="card-kicker">NACEST files</p>
            <h1>Documents</h1>
          </div>
          <span class="badge ${pending ? "info" : "ok"}">${pending ? `${pending} pending` : "All verified"}</span>
        </div>
        <section class="card">
          <div class="card-head"><h2>On file</h2></div>
          ${documentRows(rows, { showStudent: true, canVerify: true })}
        </section>
      `;
      return;
    }
    const student = scopedStudent();
    if (!student) return denied();
    const rows = data().documents.filter((item) => item.studentId === student.id);
    const pending = rows.filter((item) => item.status === "pending").length;
    content.innerHTML = `
      ${flashHtml()}
      <div class="page-head">
        <div>
          <p class="card-kicker">NACEST files · ${SsimsUi.escape(student.matricNo)}</p>
          <h1>Documents</h1>
        </div>
        <span class="badge ${pending ? "info" : "ok"}">${pending ? `${pending} pending` : "All verified"}</span>
      </div>
      <div class="stack">
        <section class="card">
          <div class="card-head"><h2>File a document record</h2></div>
          <p class="locked-note">This saves a record in the browser only. Files are not stored on a server.</p>
          <form class="form-grid" data-form="document" data-student="${student.id}">
            <label>Title<input name="title" required placeholder="WAEC certificate" autocomplete="off" /></label>
            <label>Kind
              <select name="kind">
                <option>Certificate</option>
                <option>Identity</option>
                <option>Admission</option>
                <option>Other</option>
              </select>
            </label>
            <div class="full"><button class="btn btn-primary" type="submit">Save document record</button></div>
          </form>
        </section>
        <section class="card">
          <div class="card-head"><h2>On file</h2></div>
          ${documentRows(rows, { showStudent: false, canVerify: false })}
        </section>
      </div>
    `;
  }

  function renderRequests() {
    const students = visibleStudents();
    if (!students.length) return denied();
    const store = data();
    const rows = store.requests.filter((item) => students.some((student) => student.id === item.studentId));
    content.innerHTML = `
      ${flashHtml()}
      <div class="page-head"><div><p class="card-kicker">Letters</p><h1>Requests</h1></div></div>
      ${
        staff
          ? ""
          : `<section class="card" style="margin-bottom:1rem">
              <div class="card-head"><h2>Request Letter</h2></div>
              <form class="form-grid" data-form="request" data-student="${scopedStudent().id}">
                <label>Kind
                  <select name="kind">
                    <option>Letter of studentship</option>
                    <option>Transcript</option>
                    <option>Reference letter</option>
                  </select>
                </label>
                <label>Title<input name="title" required placeholder="Bank account opening letter" /></label>
                <label class="full">Details<textarea name="body" rows="3" required></textarea></label>
                <div class="full"><button class="btn btn-primary" type="submit">Submit request</button></div>
              </form>
            </section>`
      }
      <section class="card">
        ${
          rows.length
            ? `<table class="data-table"><thead><tr><th>Title</th><th>Kind</th><th>Student</th><th>Status</th><th></th></tr></thead><tbody>${rows
                .map((item) => {
                  const owner = studentOf(item.studentId);
                  return `<tr>
                    <td>${SsimsUi.escape(item.title)}</td>
                    <td>${SsimsUi.escape(item.kind)}</td>
                    <td>${SsimsUi.escape(owner?.displayName)}</td>
                    <td><span class="badge ${SsimsUi.statusClass(item.status)}">${SsimsUi.escape(item.status)}</span></td>
                    <td>${
                      staff && item.status !== "completed"
                        ? `<button class="btn btn-sm" data-action="complete-request" data-id="${item.id}">Mark completed</button>`
                        : ""
                    }</td>
                  </tr>`;
                })
                .join("")}</tbody></table>`
            : SsimsUi.empty("No requests", "Letter and transcript requests will appear here.")
        }
      </section>
    `;
  }

  function renderMessages() {
    const store = data();
    const notes = store.notifications.filter((item) => item.userId === user.id);
    const inbox = store.messages.filter((item) => item.userId === user.id);
    notes.forEach((item) => {
      item.read = true;
    });
    inbox.forEach((item) => {
      item.read = true;
    });
    save(store);
    refreshBell();
    content.innerHTML = `
      ${flashHtml()}
      <div class="page-head"><div><p class="card-kicker">Inbox</p><h1>Messages</h1></div></div>
      <section class="card">
        ${
          inbox.length
            ? `<table class="data-table"><thead><tr><th>From</th><th>Subject</th><th>Date</th></tr></thead><tbody>${inbox
                .map(
                  (item) => `<tr>
                    <td>${SsimsUi.escape(item.from)}</td>
                    <td><strong>${SsimsUi.escape(item.subject)}</strong><p class="muted">${SsimsUi.escape(item.body)}</p></td>
                    <td>${SsimsUi.formatDate(item.createdAt)}</td>
                  </tr>`,
                )
                .join("")}</tbody></table>`
            : SsimsUi.empty("No messages", "School notices will appear here.")
        }
      </section>
      <section class="card" style="margin-top:1rem">
        <div class="card-head"><h2>Important Notice</h2></div>
        <ul class="notice-list">
          ${store.notices
            .map((item) => `<li><time>${SsimsUi.formatDate(item.date)}</time><strong>${SsimsUi.escape(item.title)}</strong><p class="muted">${SsimsUi.escape(item.body)}</p></li>`)
            .join("")}
        </ul>
      </section>
    `;
  }

  function renderSettings() {
    content.innerHTML = `
      ${flashHtml()}
      <div class="page-head"><div><p class="card-kicker">Account</p><h1>Settings</h1></div></div>
      <section class="card">
        <p>Signed in as <strong>${SsimsUi.escape(user.name)}</strong> (${SsimsUi.escape(user.role)}).</p>
        <p class="muted">NACEST SSIMS keeps this demo in your browser. Students cannot open another student's file.</p>
        ${
          user.role === "admin"
            ? `<form data-form="reset" style="margin-top:1rem"><button class="btn" type="submit">Reset demo data</button></form>`
            : ""
        }
      </section>
    `;
  }

  function closeDrawer() {
    drawer.hidden = true;
  }

  document.addEventListener("click", (event) => {
    const logout = event.target.closest("[data-action='logout']");
    if (logout) {
      SsimsAuth.signOut();
      return;
    }
    const verify = event.target.closest("[data-action='verify-doc']");
    if (verify) {
      if (!staff) return denied();
      const store = data();
      const doc = store.documents.find((item) => item.id === verify.dataset.id);
      if (!doc || doc.status === "verified") {
        SsimsUi.flash("That document is not waiting for verification.", "danger");
        route();
        return;
      }
      doc.status = "verified";
      store.activities.unshift({
        id: SsimsStore.uid("a"),
        studentId: doc.studentId,
        date: SsimsStore.now().slice(0, 10),
        activity: `${doc.title} uploaded`,
        status: "Verified",
      });
      save(store);
      SsimsUi.flash("Document marked verified.");
      if (location.hash !== "#/documents") location.hash = "#/documents";
      else route();
      return;
    }
    const complete = event.target.closest("[data-action='complete-request']");
    if (complete && staff) {
      const store = data();
      const request = store.requests.find((item) => item.id === complete.dataset.id);
      if (request) {
        request.status = "completed";
        save(store);
        SsimsUi.flash("Request marked completed.");
        route();
      }
    }
  });

  content.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    const store = data();
    const kind = form.dataset.form;
    const studentId = form.dataset.student;

    if (kind === "profile") {
      if (!canSeeStudent(studentId) || staff) return denied();
      const student = store.students.find((item) => item.id === studentId);
      if (!student) return denied();
      const phone = form.phone.value.trim();
      const state = form.state.value.trim();
      const address = form.address.value.trim();
      if (!phone || !state || !address) {
        SsimsUi.flash("Enter phone, state, and address.", "danger");
        route();
        return;
      }
      student.phone = phone;
      student.state = state;
      student.address = address;
      store.activities.unshift({
        id: SsimsStore.uid("a"),
        studentId,
        date: SsimsStore.now().slice(0, 10),
        activity: "Profile contact details",
        status: "Updated",
      });
      save(store);
      SsimsUi.flash("Contact details saved.");
      if (location.hash !== "#/records") location.hash = "#/records";
      else route();
      return;
    }

    if (kind === "register") {
      if (!canSeeStudent(studentId) || staff) return denied();
      const student = store.students.find((item) => item.id === studentId);
      const courseId = form.courseId.value;
      const course = store.courses.find((item) => item.id === courseId);
      if (!student || !course || course.level !== student.level) {
        SsimsUi.flash("That course is not open for this level.", "danger");
        route();
        return;
      }
      if (store.enrollments.some((item) => item.studentId === studentId && item.courseId === courseId)) {
        SsimsUi.flash("That course is already registered.", "danger");
        route();
        return;
      }
      store.enrollments.push({ id: SsimsStore.uid("e"), studentId, courseId, status: "registered" });
      store.activities.unshift({
        id: SsimsStore.uid("a"),
        studentId,
        date: SsimsStore.now().slice(0, 10),
        activity: `Registered ${course.code}`,
        status: "Completed",
      });
      save(store);
      SsimsUi.flash(`${course.code} registered.`);
      if (location.hash !== "#/academic") location.hash = "#/academic";
      else route();
      return;
    }

    if (kind === "pay") {
      if (!canSeeStudent(studentId) || staff) return denied();
      const payment = store.payments.find((item) => item.id === form.paymentId.value && item.studentId === studentId);
      if (!payment || payment.status !== "due") {
        SsimsUi.flash("There is no outstanding fee to pay.", "danger");
        route();
        return;
      }
      const method = String(form.method?.value || "Bank transfer").trim() || "Bank transfer";
      payment.status = "paid";
      payment.method = method;
      payment.paidAt = SsimsStore.now();
      store.activities.unshift({
        id: SsimsStore.uid("a"),
        studentId,
        date: payment.paidAt.slice(0, 10),
        activity: `${payment.title} — ${SsimsStore.formatNaira(payment.amount)}`,
        status: "Successful",
      });
      save(store);
      SsimsUi.flash(`${SsimsStore.formatNaira(payment.amount)} recorded. No live charge was taken.`);
      if (location.hash !== "#/payments") location.hash = "#/payments";
      else route();
      return;
    }

    if (kind === "document") {
      if (!canSeeStudent(studentId) || staff) return denied();
      const title = form.title.value.trim();
      const docKind = String(form.kind.value || "").trim();
      if (!title || !docKind) {
        SsimsUi.flash("Enter a document title and kind.", "danger");
        route();
        return;
      }
      store.documents.unshift({
        id: SsimsStore.uid("d"),
        studentId,
        title,
        kind: docKind,
        status: "pending",
        uploadedAt: SsimsStore.now(),
      });
      store.activities.unshift({
        id: SsimsStore.uid("a"),
        studentId,
        date: SsimsStore.now().slice(0, 10),
        activity: `${title} uploaded`,
        status: "Pending",
      });
      save(store);
      SsimsUi.flash("Document submitted for verification.");
      if (location.hash !== "#/documents") location.hash = "#/documents";
      else route();
      return;
    }

    if (kind === "request") {
      if (!canSeeStudent(studentId) || staff) return denied();
      store.requests.unshift({
        id: SsimsStore.uid("q"),
        studentId,
        kind: form.kind.value,
        title: form.title.value.trim(),
        body: form.body.value.trim(),
        status: "pending",
        createdAt: SsimsStore.now(),
      });
      save(store);
      SsimsUi.flash("Request submitted.");
      route();
      return;
    }

    if (kind === "reset" && user.role === "admin") {
      SsimsStore.reset();
      SsimsStore.setSession(user.id);
      SsimsUi.flash("Demo data reset.");
      route();
    }
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const q = searchInput.value.trim();
    location.hash = q ? `#/?q=${encodeURIComponent(q)}` : "#/";
  });

  userChip.addEventListener("click", () => {
    location.hash = "#/settings";
  });

  menuBtn.addEventListener("click", () => {
    drawer.hidden = false;
  });
  document.getElementById("drawer-backdrop").addEventListener("click", closeDrawer);
  drawerPanel.addEventListener("click", (event) => {
    if (event.target.closest("a,button")) closeDrawer();
  });

  window.addEventListener("hashchange", route);
  route();
})();
