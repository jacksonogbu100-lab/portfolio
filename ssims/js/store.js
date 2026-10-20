const STORE_KEY = "ssims-nacest-v2";
const SESSION_KEY = "ssims-session";
const PASSWORD = "ssims-dev";

const SsimsStore = (() => {
  function uid(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function now() {
    return new Date().toISOString();
  }

  function seed() {
    return {
      version: 5,
      users: [
        { id: "u-james", email: "admin@nacest.local", password: PASSWORD, name: "James Brown", role: "admin", studentId: "", status: "active" },
        { id: "u-emma", email: "registrar@nacest.local", password: PASSWORD, name: "Emma Taylor", role: "registrar", studentId: "", status: "active" },
        { id: "u-famous", email: "famous@nacest.local", password: PASSWORD, name: "Famous Aja", role: "student", studentId: "st-famous", status: "active" },
        { id: "u-david", email: "david@nacest.local", password: PASSWORD, name: "David Williams", role: "student", studentId: "st-david", status: "active" },
        { id: "u-mary", email: "mary@nacest.local", password: PASSWORD, name: "Mary Johnson", role: "student", studentId: "st-mary", status: "active" },
      ],
      students: [
        {
          id: "st-famous",
          userId: "u-famous",
          matricNo: "22/CS/1045",
          displayName: "Famous Aja",
          email: "famous@nacest.local",
          phone: "+234 803 441 2290",
          department: "Computer Science",
          faculty: "Science",
          programme: "HND Computer Science",
          level: "300",
          mode: "Undergraduate",
          session: "2024/2025",
          sessionStatus: "Ongoing",
          cgpa: 4.27,
          gender: "Male",
          dateOfBirth: "2004-03-18",
          address: "NASME Barracks, Makurdi",
          state: "Benue",
          status: "active",
        },
        {
          id: "st-david",
          userId: "u-david",
          matricNo: "23/CS/1188",
          displayName: "David Williams",
          email: "david@nacest.local",
          phone: "+234 701 552 3341",
          department: "Computer Science",
          faculty: "Science",
          programme: "B.Sc. Computer Science",
          level: "200",
          mode: "Undergraduate",
          session: "2024/2025",
          sessionStatus: "Ongoing",
          cgpa: 3.64,
          gender: "Male",
          dateOfBirth: "2005-07-02",
          address: "8 Aminu Kano Crescent, Abuja",
          state: "FCT",
          status: "active",
        },
        {
          id: "st-mary",
          userId: "u-mary",
          matricNo: "24/CS/0912",
          displayName: "Mary Johnson",
          email: "mary@nacest.local",
          phone: "+234 809 220 1188",
          department: "Computer Science",
          faculty: "Science",
          programme: "B.Sc. Computer Science",
          level: "100",
          mode: "Undergraduate",
          session: "2024/2025",
          sessionStatus: "Ongoing",
          cgpa: 3.91,
          gender: "Female",
          dateOfBirth: "2006-11-21",
          address: "21 Aba Road, Port Harcourt",
          state: "Rivers",
          status: "active",
        },
      ],
      courses: [
        { id: "c-csc301", code: "CSC 301", title: "Data Structures and Algorithms", units: 3, semester: "First", session: "2024/2025", level: "300" },
        { id: "c-csc303", code: "CSC 303", title: "Operating Systems", units: 3, semester: "First", session: "2024/2025", level: "300" },
        { id: "c-csc305", code: "CSC 305", title: "Database Systems", units: 3, semester: "First", session: "2024/2025", level: "300" },
        { id: "c-mth301", code: "MTH 301", title: "Numerical Analysis", units: 3, semester: "First", session: "2024/2025", level: "300" },
        { id: "c-gst301", code: "GST 301", title: "Entrepreneurship Studies", units: 2, semester: "First", session: "2024/2025", level: "300" },
        { id: "c-csc307", code: "CSC 307", title: "Software Engineering", units: 3, semester: "First", session: "2024/2025", level: "300" },
        { id: "c-csc309", code: "CSC 309", title: "Computer Networks", units: 3, semester: "First", session: "2024/2025", level: "300" },
        { id: "c-csc201", code: "CSC 201", title: "Computer Programming I", units: 3, semester: "First", session: "2024/2025", level: "200" },
        { id: "c-csc203", code: "CSC 203", title: "Discrete Structures", units: 3, semester: "First", session: "2024/2025", level: "200" },
        { id: "c-csc101", code: "CSC 101", title: "Introduction to Computing", units: 3, semester: "First", session: "2024/2025", level: "100" },
        { id: "c-gst101", code: "GST 101", title: "Use of English", units: 2, semester: "First", session: "2024/2025", level: "100" },
      ],
      enrollments: [
        { id: "e-1", studentId: "st-famous", courseId: "c-csc301", status: "registered" },
        { id: "e-2", studentId: "st-famous", courseId: "c-csc303", status: "registered" },
        { id: "e-3", studentId: "st-famous", courseId: "c-csc305", status: "registered" },
        { id: "e-4", studentId: "st-famous", courseId: "c-mth301", status: "registered" },
        { id: "e-5", studentId: "st-famous", courseId: "c-gst301", status: "registered" },
        { id: "e-6", studentId: "st-david", courseId: "c-csc201", status: "registered" },
        { id: "e-7", studentId: "st-david", courseId: "c-csc203", status: "registered" },
        { id: "e-8", studentId: "st-mary", courseId: "c-csc101", status: "registered" },
        { id: "e-9", studentId: "st-mary", courseId: "c-gst101", status: "registered" },
      ],
      results: [
        { id: "r-1", studentId: "st-famous", courseId: "c-csc301", score: 84, grade: "A", session: "2024/2025", semester: "First" },
        { id: "r-2", studentId: "st-famous", courseId: "c-csc303", score: 79, grade: "A", session: "2024/2025", semester: "First" },
        { id: "r-3", studentId: "st-famous", courseId: "c-csc305", score: 88, grade: "A", session: "2024/2025", semester: "First" },
        { id: "r-4", studentId: "st-famous", courseId: "c-mth301", score: 68, grade: "B", session: "2024/2025", semester: "First" },
        { id: "r-5", studentId: "st-famous", courseId: "c-gst301", score: 81, grade: "A", session: "2024/2025", semester: "First" },
        { id: "r-6", studentId: "st-david", courseId: "c-csc201", score: 71, grade: "B", session: "2024/2025", semester: "First" },
        { id: "r-7", studentId: "st-david", courseId: "c-csc203", score: 64, grade: "B", session: "2024/2025", semester: "First" },
        { id: "r-8", studentId: "st-mary", courseId: "c-csc101", score: 76, grade: "A", session: "2024/2025", semester: "First" },
      ],
      payments: [
        { id: "p-1", studentId: "st-famous", reference: "NACEST-FEE-2025-0142", title: "School fees 2024/2025", amount: 185000, status: "paid", method: "Bank transfer", paidAt: "2025-08-18T10:12:00.000Z", dueDate: "2025-09-01" },
        { id: "p-2", studentId: "st-famous", reference: "NACEST-ID-2025-0088", title: "Student ID card", amount: 3500, status: "paid", method: "Cash", paidAt: "2025-09-04T09:00:00.000Z", dueDate: "2025-09-15" },
        { id: "p-6", studentId: "st-famous", reference: "NACEST-DUE-2026-0044", title: "Departmental dues 2024/2025", amount: 12500, status: "due", method: "", paidAt: "", dueDate: "2026-09-30" },
        { id: "p-3", studentId: "st-david", reference: "SSIMS-FEE-2025-0210", title: "School fees 2024/2025", amount: 185000, status: "due", method: "", paidAt: "", dueDate: "2025-09-01" },
        { id: "p-4", studentId: "st-david", reference: "SSIMS-ID-2025-0112", title: "Student ID card", amount: 3500, status: "paid", method: "Card", paidAt: "2025-08-22T14:40:00.000Z", dueDate: "2025-09-15" },
        { id: "p-5", studentId: "st-mary", reference: "SSIMS-FEE-2025-0301", title: "School fees 2024/2025", amount: 185000, status: "paid", method: "Bank transfer", paidAt: "2025-08-11T11:05:00.000Z", dueDate: "2025-09-01" },
      ],
      documents: [
        { id: "d-1", studentId: "st-famous", title: "WAEC certificate", kind: "Certificate", status: "verified", uploadedAt: "2025-09-10T08:30:00.000Z" },
        { id: "d-2", studentId: "st-famous", title: "Birth certificate", kind: "Identity", status: "verified", uploadedAt: "2025-08-02T12:00:00.000Z" },
        { id: "d-5", studentId: "st-famous", title: "National identification card", kind: "Identity", status: "pending", uploadedAt: "2026-09-06T10:00:00.000Z" },
        { id: "d-3", studentId: "st-david", title: "JAMB admission letter", kind: "Admission", status: "pending", uploadedAt: "2025-09-01T16:20:00.000Z" },
        { id: "d-4", studentId: "st-mary", title: "Passport photograph", kind: "Identity", status: "verified", uploadedAt: "2025-08-09T09:15:00.000Z" },
      ],
      requests: [
        { id: "q-1", studentId: "st-famous", kind: "Letter of studentship", title: "Bank account opening letter", body: "Needed for a student account at First Bank.", status: "completed", createdAt: "2025-08-20T10:00:00.000Z" },
        { id: "q-2", studentId: "st-david", kind: "Transcript", title: "Official transcript request", body: "For a summer internship application.", status: "pending", createdAt: "2026-09-02T09:12:00.000Z" },
      ],
      messages: [
        { id: "m-1", userId: "u-famous", from: "Academic Office", subject: "First semester results published", body: "Your 2024/2025 first semester results are now available under Academic Information.", read: false, createdAt: "2025-09-02T08:00:00.000Z" },
        { id: "m-2", userId: "u-famous", from: "Student Affairs", subject: "Collection of student ID cards", body: "ID cards for 300-level students can be collected at the faculty office this week.", read: false, createdAt: "2026-09-04T11:30:00.000Z" },
        { id: "m-3", userId: "u-famous", from: "ICT Unit", subject: "Scheduled portal maintenance", body: "The NACEST SSIMS portal will be briefly unavailable on Sunday from 1:00 to 3:00 a.m.", read: false, createdAt: "2026-09-05T18:00:00.000Z" },
        { id: "m-4", userId: "u-james", from: "System", subject: "New transcript request", body: "David Williams submitted a transcript request.", read: true, createdAt: "2026-09-02T09:13:00.000Z" },
      ],
      notices: [
        { id: "n-1", title: "Registration for 1st Semester is now open", body: "Course registration closes on 30 September 2026.", date: "2026-09-01" },
        { id: "n-2", title: "Scheduled maintenance", body: "The portal will pause on Sunday, 1:00–3:00 a.m.", date: "2026-09-05" },
        { id: "n-3", title: "Collection of student ID cards", body: "Collect at the Faculty of Science office with your clearance slip.", date: "2026-09-04" },
      ],
      activities: [
        { id: "a-1", studentId: "st-famous", date: "2025-08-12", activity: "Course registration for 2024/2025 first semester", status: "Completed" },
        { id: "a-2", studentId: "st-famous", date: "2025-08-18", activity: "School fees payment — ₦185,000.00", status: "Successful" },
        { id: "a-3", studentId: "st-famous", date: "2025-09-02", activity: "First semester results published", status: "View Result" },
        { id: "a-4", studentId: "st-famous", date: "2025-09-10", activity: "WAEC certificate uploaded", status: "Verified" },
        { id: "a-5", studentId: "st-famous", date: "2026-01-15", activity: "Profile contact details", status: "Updated" },
        { id: "a-6", studentId: "st-david", date: "2026-09-02", activity: "Transcript request submitted", status: "Pending" },
      ],
      timetable: [
        { id: "t-1", courseId: "c-csc301", day: "Monday", start: "09:00", end: "11:00", room: "CS Lab 2" },
        { id: "t-2", courseId: "c-csc303", day: "Tuesday", start: "11:00", end: "13:00", room: "LT 3" },
        { id: "t-3", courseId: "c-csc305", day: "Wednesday", start: "09:00", end: "11:00", room: "CS Lab 1" },
        { id: "t-4", courseId: "c-mth301", day: "Thursday", start: "13:00", end: "15:00", room: "MATH 2" },
        { id: "t-5", courseId: "c-gst301", day: "Friday", start: "10:00", end: "12:00", room: "Main Hall" },
        { id: "t-10", courseId: "c-csc307", day: "Monday", start: "15:00", end: "17:00", room: "LT 2" },
        { id: "t-11", courseId: "c-csc309", day: "Friday", start: "13:00", end: "15:00", room: "CS Lab 2" },
        { id: "t-6", courseId: "c-csc201", day: "Monday", start: "13:00", end: "15:00", room: "CS Lab 1" },
        { id: "t-7", courseId: "c-csc203", day: "Wednesday", start: "11:00", end: "13:00", room: "LT 1" },
        { id: "t-8", courseId: "c-csc101", day: "Tuesday", start: "09:00", end: "11:00", room: "LT 4" },
        { id: "t-9", courseId: "c-gst101", day: "Thursday", start: "09:00", end: "11:00", room: "Main Hall" },
      ],
      notifications: [
        { id: "nt-1", userId: "u-famous", title: "Results published", body: "First semester results are ready to view.", href: "#/academic", read: false, createdAt: "2025-09-02T08:00:00.000Z" },
        { id: "nt-2", userId: "u-famous", title: "ID card collection", body: "Collect your student ID at the faculty office.", href: "#/records", read: false, createdAt: "2026-09-04T11:30:00.000Z" },
        { id: "nt-3", userId: "u-famous", title: "Registration is open", body: "Complete course registration before 30 September.", href: "#/academic", read: false, createdAt: "2026-09-01T09:00:00.000Z" },
        { id: "nt-4", userId: "u-james", title: "Pending transcript", body: "David Williams requested an official transcript.", href: "#/requests", read: false, createdAt: "2026-09-02T09:13:00.000Z" },
      ],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) {
        const data = seed();
        save(data);
        return data;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 5) {
        const data = seed();
        save(data);
        return data;
      }
      return parsed;
    } catch (err) {
      const data = seed();
      save(data);
      return data;
    }
  }

  function save(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  function reset() {
    const data = seed();
    save(data);
    return data;
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      const data = load();
      const user = data.users.find((item) => item.id === session.userId && item.status === "active");
      return user || null;
    } catch (err) {
      return null;
    }
  }

  function setSession(userId) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId, signedInAt: now() }));
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function formatNaira(amount) {
    const value = Number(amount) || 0;
    return `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function outstandingFees(studentId) {
    const data = load();
    return data.payments
      .filter((item) => item.studentId === studentId && item.status === "due")
      .reduce((sum, item) => sum + Number(item.amount), 0);
  }

  function studentForUser(user) {
    if (!user || !user.studentId) return null;
    return load().students.find((item) => item.id === user.studentId) || null;
  }

  function courseById(courseId) {
    return load().courses.find((item) => item.id === courseId) || null;
  }

  return {
    uid,
    now,
    load,
    save,
    reset,
    getSession,
    setSession,
    clearSession,
    formatNaira,
    outstandingFees,
    studentForUser,
    courseById,
    PASSWORD,
  };
})();
