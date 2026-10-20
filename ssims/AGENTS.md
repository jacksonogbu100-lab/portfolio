# Project Guidebook

This file is the operating manual for every agent working in this repository. **Read this file and `IMPLEMENTATION.md` before doing any other work.** Do not implement, refactor, or invent features until those two documents have been consulted for the current request.

## Product

**SSIMS** is a **Secure Student Information Management System** for **NACEST** (Nigerian Army College of Environmental Science and Technology, Makurdi). The case study is the college desk where students see only their own file, and a registrar or admin manages records, academics, fees, documents, and requests.

Everything runs as **static HTML, CSS, and JavaScript**. Demo data lives in the browser (`localStorage`). Do not introduce Next.js, React, a Node server, or a database unless `IMPLEMENTATION.md` is updated first.

## How to start every task

1. Read this guidebook and `IMPLEMENTATION.md`.
2. Identify the **current phase** and whether the request belongs in it.
3. If the request jumps ahead of the plan, say so, then either stay in the current phase or propose a documented phase adjustment.
4. Implement only what the phase and the user’s prompt require.
5. After a phase’s acceptance criteria are met, update the **Current phase** section in `IMPLEMENTATION.md`.

## Working rules

- Follow the agreed stack in `IMPLEMENTATION.md`. Do not swap to a framework without an explicit user decision recorded in that file.
- Prefer small, complete slices: data in `js/store.js` → screen in HTML/JS → validation of the happy path.
- Keep domain language consistent: **student** (the enrolled person), **user** (a login account), **record**, **result**, **request**.
- Money is **naira (₦)**. Demo people use **simple common English names**.
- UI must be usable: loading, empty, error, and permission-denied states for every new screen.
- Do not add markdown files the user did not ask for. Do not commit unless the user asks.
- When changing UI, verify the real user flow (browser or the closest available substitute) before calling the work done.

## Roles (access)

| Role | Intended access |
| --- | --- |
| `admin` | Users, all student files, fees, documents, requests, demo reset |
| `registrar` | All student files, academics, fees, documents, requests |
| `student` | Own profile, academics, payments, documents, requests, messages |

Enforce role checks in JavaScript before rendering a screen. UI hiding is not enough — send the wrong role home.

## Source of truth

| Document | Purpose |
| --- | --- |
| `AGENTS.md` | How agents must work |
| `IMPLEMENTATION.md` | What we are building, in which order |
| `.cursor/rules/` | Short, always-on reminders of the above |

If these documents disagree, stop and align them before coding. The user’s latest explicit instruction wins, then update the docs so the next session stays consistent.
