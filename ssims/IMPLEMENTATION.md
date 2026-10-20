# SSIMS — Implementation Plan

Working name: **SSIMS**  
Full name: Secure Student Information Management System  
Case study: **NACEST** (Nigerian Army College of Environmental Science and Technology, Makurdi)

This document is the product and delivery plan. Agents must read it with `AGENTS.md` before any implementation.

---

## Current phase

| Field | Value |
| --- | --- |
| Status | Phase 6 ready for review; stay in **Phase 6** until accepted |
| Active phase | **Phase 6 — Documents** |
| Last completed | Phase 5: own fees in naira and demo payment on a due item |
| Next up | Famous Aja files a document record; staff mark pending files verified. Do not expand later screens. |

An early draft of later phases (records, academics, payments, documents, requests, messages, staff directory) already exists in `app.html`. Treat those as **out of scope until this phase is accepted**. Fix bugs on them if they break login or the dashboard; do not add new product scope there.

---

## 1. What we are building

This build is a **case study of NACEST**, using SSIMS as the in-house student-records desk. It is not a public admissions portal, LMS, or live payment gateway.

The core job is:

1. Sign in with a role (`admin`, `registrar`, or `student`).
2. Let a **student** see only their own dashboard, records, results, fees, and requests.
3. Let **staff** open the student directory and process fees, documents, and letters.
4. Keep money in **naira** and people on **simple English names**.

### Why HTML, CSS, and JavaScript

The application stays **in one static box**:

- Plain **HTML** pages
- One shared **CSS** file
- **JavaScript** for login, screens, and validation
- **localStorage** for demo records (no server, no database)

A Next.js or React rewrite is out of scope unless this plan is revised.

---

## 2. Who uses it

| Role | Who | Primary jobs |
| --- | --- | --- |
| Admin | School officer | Users, all records, demo reset |
| Registrar | Records desk | Student files, academics, fees, documents, requests |
| Student | Enrolled person | Own dashboard, profile, results, payments, letters |

---

## 3. Agreed stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Markup | HTML | `index.html`, `login.html`, `app.html` |
| Style | CSS | `css/style.css` |
| Behaviour | JavaScript | `js/store.js`, `js/auth.js`, `js/ui.js`, page scripts |
| Data | localStorage | Seeded on first visit; reset from Settings (admin) |
| Money | Nigerian naira (₦) | Never `$` |
| Names | Simple English | James, Emma, Famous, David, Mary |

Do not change this table without an explicit decision recorded here.

---

## 4. Application map

```
index.html              Case study landing + demo accounts
login.html              Sign in
app.html                Signed-in app (hash routes below)
  #/                    Dashboard (Phase 2)
  #/records             Own student file (Phase 3)
  #/students            Staff directory (Phase 9)
  #/students/:id        Staff student file (Phase 9)
  #/academic            Courses, results, timetable (Phase 4)
  #/payments            Fees in naira (Phase 5)
  #/documents           File records (Phase 6)
  #/requests            Letters and transcripts (Phase 7)
  #/messages            Inbox and notices (Phase 8)
  #/settings            Account / demo reset (Phase 10)
```

---

## 5. Domain language

| Term | Meaning |
| --- | --- |
| Student | An enrolled person with a matric number |
| User | A login account (`admin`, `registrar`, or `student`) |
| Record | Biodata and school file for a student |
| Result | A published course score and grade |
| Request | A letter or transcript job for the desk |
| Notice | A school announcement on the dashboard |

---

## 6. How to run

Open the files in a browser. A local static server is preferred:

```bash
python3 -m http.server 8081
```

Then visit [http://localhost:8081](http://localhost:8081).

Demo password for every seeded account: **`ssims-dev`**

| Role | Name | Email |
| --- | --- | --- |
| Admin | James Brown | `admin@nacest.local` |
| Registrar | Emma Taylor | `registrar@nacest.local` |
| Student | Famous Aja | `famous@nacest.local` |
| Student | David Williams | `david@nacest.local` |

---

## 7. Phases

Work **one phase at a time**. Do not start the next phase until the current phase’s acceptance list is met and this file is updated.

### Phase 1 — Foundation

Landing, login, session, roles, seeded `localStorage`.

**Acceptance**

- [x] `index.html` explains SSIMS and lists demo accounts
- [x] Sign-in with `ssims-dev`; wrong password shows an error
- [x] Signed-in users reach `app.html`; signed-out users are sent to login
- [x] Students cannot be treated as staff in JavaScript role checks

### Phase 2 — Student dashboard

Famous Aja’s home must match the case-study mockup: navy sidebar, centered search, welcome banner, four summary cards, recent activities, profile rail, quick actions, notices, footer.

**Acceptance**

- [x] Dashboard layout matches the mockup on a desktop width
- [x] Cards show level, CGPA, session, and outstanding fees in ₦
- [x] Bell shows unread count; Logout ends the session
- [x] Search filters the activities list for the signed-in student

### Phase 3 — Student records

Own biodata. Student may edit contact details only.

**Acceptance**

- [x] Famous Aja opens `#/records` and sees his own NACEST file
- [x] College fields (name, matric, programme, department, faculty, level, session, gender, date of birth, email) are read-only
- [x] Phone, address, and state can be saved; empty values are rejected
- [x] After save, the same records page and the dashboard profile show the new contact details

### Phase 4 — Academic information

Registered courses, results, timetable, course registration for the signed-in student.

**Acceptance**

- [x] Famous Aja sees only his own registered courses, results, and timetable
- [x] Remaining 300-level courses can be registered
- [x] After registration, the course and its timetable slot appear on the same page
- [x] Staff do not get a full academic desk in this phase

### Phase 5 — Payments

Fee list in naira. Student can record a demo payment on a due item. No live card charge.

**Acceptance**

- [x] Famous Aja sees only his own fee history, amounts in ₦
- [x] A due item can be recorded as paid (demo only; no live charge)
- [x] After payment, the list and dashboard outstanding fees show cleared
- [x] Staff do not get a full fees desk in this phase

### Phase 6 — Documents (current)

Student files a document record. Staff can mark it verified. No server file storage.

**Acceptance**

- [ ] Famous Aja opens `#/documents` and sees only his own file records
- [ ] A document record can be filed (title and kind; demo record only, no server upload)
- [ ] Empty title is rejected; after save the list shows the new record as pending
- [ ] Staff can mark a pending document verified; the list then shows verified
- [ ] Students cannot verify files or see another student's documents

### Phase 7 — Requests

Student submits a letter or transcript request. Staff can mark it completed.

### Phase 8 — Messages and notices

Inbox for the signed-in user. Opening messages marks notifications read.

### Phase 9 — Staff directory

Admin and registrar see all students. A student opening `#/students` is sent to their own records.

### Phase 10 — Settings

Account summary. Admin can reset demo data.

---

## 8. Explicitly not in this product

- Live card payments or a payment gateway
- Server-side file storage
- Email or SMS
- A Node/Next.js server or a database

---

## Appendix — Decision log

| Date | Decision |
| --- | --- |
| 2026-09-07 | New case study folder: **SSIMS**. Stack is **HTML, CSS, and JavaScript**. Currency is **naira (₦)**. People use **simple common English names**. Data is localStorage. |
| 2026-09-07 | Phase 2 student dashboard accepted: layout, naira fees, search, logout. Next is Phase 3 (student records). |
| 2026-09-07 | **User instruction:** case study is **NACEST** (Makurdi). Demo student is **Famous Aja** (`famous@nacest.local`), not Sarah Adu. |
| 2026-09-07 | Phase 3 student records accepted: locked college biodata, editable contact details only. Next is Phase 4 (academic information). |
| 2026-09-07 | Phase 4 academic information accepted: own courses, results, timetable, and registration. Next is Phase 5 (payments). |
| 2026-09-07 | Phase 5 payments accepted: own fees in naira and demo payment. Next is Phase 6 (documents). |
