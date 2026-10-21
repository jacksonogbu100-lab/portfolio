const portfolio = {
  name: "Jackson Ogbu",
  role: "Product Manager, UI/UX Designer, and Full Stack Developer. I create thoughtful digital products through strategy, design, and technology.",
  email: "jacskonogbu100@gmail.com",
  about: [
    "I'm a product manager, UI/UX designer, and full stack developer. I work across the life of a product: the problem, the interface, and the software behind it.",
    "Strategy, design, and engineering stay in one conversation. The result should be clear for the people using it and solid for the people shipping it.",
    "I'm open to collaborations that need product thinking, interface design, and a full-stack build — from the first brief through to something people can use.",
  ],
  focuses: [
    { value: "Product", label: "Strategy" },
    { value: "Design", label: "UI / UX" },
    { value: "Code", label: "Full stack" },
    { value: "Launch", label: "Delivery" },
  ],
  projectsIntro:
    "Selected work across product, design, and a full build.",
  projects: [
    {
      title: "Hearth",
      description:
        "A real-time community platform for instant messaging, voice and video calls, presence, notifications, and moderation, with large communities running at the same time.",
      image: "images/hearth.jpg",
      alt: "Hearth voice room during story hour, with speaker cards, an audience grid, and a live voice connection",
      href: "hearth/index.html",
      linkLabel: "View the site",
      tags: ["Realtime", "Voice", "JavaScript", "Communities"],
    },
    {
      title: "Meridian",
      description:
        "An API gateway and developer platform for authentication, rate limits, traffic routing, service discovery, monitoring, and usage billing.",
      image: "images/meridian.jpg",
      alt: "Meridian gateway monitor with request totals, service bars, status codes, and a live edge log",
      href: "meridian/",
      linkLabel: "View the site",
      tags: ["APIs", "Gateway", "JavaScript", "Platform"],
    },
    {
      title: "AetherOps",
      description:
        "An autonomous AI agent platform that plans tasks, uses tools, writes code, and completes business workflows with limited human intervention.",
      image: "images/aetherops.jpg",
      alt: "AetherOps AI Workflow Command Center dashboard with routing map, agent health, and approvals",
      href: "aetherops/",
      linkLabel: "View the site",
      tags: ["LLMs", "Python", "APIs", "Agents"],
    },
    {
      title: "Army Aptitude",
      description:
        "A timed practice test for Nigerian Army screening. Forty questions across numerical, verbal, abstract, and general knowledge, then a scored result sheet.",
      image: "images/army-aptitude-class.jpg",
      alt: "A classroom of cadets in orange camouflage writing at their desks",
      href: "army-aptitude/",
      linkLabel: "View the site",
      tags: ["HTML", "CSS", "JavaScript", "Nigeria"],
    },
    {
      title: "SSIMS",
      description:
        "Student records, academics, and fees for NACEST in Makurdi. Students see their own file. Registrars and admins manage the rest.",
      image: "images/ssims-graduates.jpg",
      alt: "Graduates in black and yellow gowns throwing their caps on the lawn in front of a campus building",
      href: "ssims/",
      linkLabel: "View the site",
      tags: ["HTML", "CSS", "JavaScript", "Education"],
    },
    {
      title: "Naija Dishes",
      description:
        "A menu for the Gwarinpa and Jahi kitchens in Abuja. Browse soups, swallow, and rice, then send the cart on WhatsApp.",
      image: "naija-dishes/assets/naija-dishes-meals.webp",
      alt: "A spread of Nigerian meals from Naija Dishes",
      href: "naija-dishes/",
      linkLabel: "View the site",
      tags: ["HTML", "CSS", "JavaScript", "Abuja"],
    },
    {
      title: "SAM Laundry Studio",
      description:
        "Staff workspace for a dry cleaning center: sign in, take orders, and print from the counter.",
      image: "images/laundry.png",
      alt: "A worker carrying a large bag of linens past industrial washers in a commercial laundry",
      href: "sam/",
      linkLabel: "View the site",
      tags: ["HTML", "CSS", "JavaScript", "Laundry"],
    },
    {
      title: "Bolt Driver",
      description:
        "A simulated driver app for Nigeria. Choose a city, go online, and take a ride with fares in naira.",
      image: "images/bolt.jpg",
      alt: "Bolt Driver welcome screen, asking for a name and a Nigerian city before a shift",
      href: "bolt/",
      linkLabel: "View the site",
      tags: ["React", "TypeScript", "Nigeria"],
    },
    {
      title: "PayJ",
      description:
        "A demo mobile wallet for transfers, bills, airtime, savings, and cards.",
      image: "images/payj.jpg",
      alt: "PayJ home screen showing an available balance, send and withdraw actions, and bill services",
      href: "payj/",
      linkLabel: "View the site",
      tags: ["React", "TypeScript", "Wallet"],
    },
    {
      title: "Greenhills City",
      description:
        "A site for Army-Efab Jumong land in Usuma District, Abuja. It shows the plot sizes, the printed rates, and a WhatsApp enquiry.",
      image: "greenhills/images/abuja-top-view.jpg",
      alt: "Aerial view of a fast-growing Abuja district, with new houses, bare plots, and a wide road toward the hills.",
      href: "greenhills/index.html",
      linkLabel: "View the site",
      tags: ["HTML", "CSS", "JavaScript", "Abuja"],
    },
    {
      title: "StyleHub",
      description:
        "Sunnx Clothing, an online fashion desk where a customer picks a design, saves measurements, pays, and tracks the order.",
      image: "images/stylehub.jpg",
      alt: "Ankara dress from the StyleHub design catalog",
      href: "https://github.com/jacksonogbu100-lab/StyleHub",
      linkLabel: "View on GitHub",
      external: true,
      tags: ["JavaScript", "HTML", "CSS", "Fashion"],
    },
  ],
  services: [
    "Product Strategy",
    "UI/UX Design",
    "Full-Stack Development",
    "Interface Design",
    "Prototyping",
    "Product Management",
  ],
  contactLead:
    "I'm open to new work, collaborations, and conversations about a product you're trying to make.",
  footerLine:
    "Creating thoughtful digital products through strategy, design, and technology.",
};

const icons = {
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="M4 7l8 6 8-6"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2-6z"/></svg>',
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderPortfolio() {
  const root = document.querySelector("#app");
  if (!root) return;

  const about = portfolio.about.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

  const focuses = portfolio.focuses
    .map(
      (focus) => `
        <div class="focus">
          <p class="focus-value">${escapeHtml(focus.value)}</p>
          <p class="focus-label">${escapeHtml(focus.label)}</p>
        </div>
      `
    )
    .join("");

  const projects = portfolio.projects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-media">
            ${
              project.href
                ? `<a href="${escapeHtml(project.href)}"${project.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`
                : ""
            }
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.alt || "")}" />
            ${project.href ? "</a>" : ""}
          </div>
          <div class="project-body">
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <ul class="tags">
              ${project.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}
            </ul>
            ${
              project.href
                ? `<a class="project-link" href="${escapeHtml(project.href)}"${project.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escapeHtml(project.linkLabel || "View project")}</a>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");

  const services = portfolio.services
    .map((service) => `<li>${escapeHtml(service)}</li>`)
    .join("");

  const links = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Projects", "#projects"],
    ["Contact", "#contact"],
  ];

  const navLinks = links
    .map(([label, href]) => `<a href="${href}">${label}</a>`)
    .join("");

  root.innerHTML = `
    <header class="nav" id="nav">
      <div class="shell nav-bar">
        <a class="brand" href="#home">${escapeHtml(portfolio.name)}</a>
        <nav class="nav-desktop" aria-label="Sections">
          ${navLinks}
          <a class="btn btn-primary" href="#contact">Contact Me</a>
        </nav>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
          ${icons.menu}
        </button>
      </div>
      <div class="mobile-menu" id="mobile-menu" hidden>
        <nav aria-label="Mobile sections">
          ${navLinks}
          <a class="btn btn-primary" href="#contact">Contact Me</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero" id="home">
        <div class="hero-gradient"></div>
        <div class="hero-photo"></div>
        <div class="orb orb-a"></div>
        <div class="orb orb-b"></div>
        <div class="orb orb-c"></div>
        <div class="hero-content">
          <h1>${escapeHtml(portfolio.name)}</h1>
          <p class="lede">${escapeHtml(portfolio.role)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" href="#projects">View My Work</a>
            <a class="btn btn-outline btn-lg" href="#contact">Get In Touch</a>
            <a class="btn btn-outline btn-lg" href="mailto:${escapeHtml(portfolio.email)}">Email Me</a>
          </div>
          <div class="socials">
            <a class="icon-button" href="mailto:${escapeHtml(portfolio.email)}" aria-label="Email ${escapeHtml(portfolio.name)}">${icons.mail}</a>
          </div>
          <a class="scroll-cue" href="#about" aria-label="Scroll to about">${icons.chevron}</a>
        </div>
      </section>

      <section class="about" id="about">
        <div class="shell">
          <div class="about-copy-wrap">
            <h2 class="section-title">About Me</h2>
            <div class="about-copy">${about}</div>
          </div>
          <div class="focus-grid">${focuses}</div>
        </div>
      </section>

      <section class="projects" id="projects">
        <div class="shell">
          <div class="section-intro">
            <h2 class="section-title">Featured Projects</h2>
            <p>${escapeHtml(portfolio.projectsIntro)}</p>
          </div>
          <div class="project-grid">${projects}</div>
        </div>
      </section>

      <section class="contact" id="contact">
        <div class="shell">
          <div class="section-intro">
            <h2 class="section-title">Let's Work Together</h2>
            <p>Have a project in mind? I'd like to hear about it.</p>
          </div>
          <div class="contact-grid">
            <div>
              <h3>Get In Touch</h3>
              <p class="contact-lead">${escapeHtml(portfolio.contactLead)}</p>
              <div class="contact-detail">
                <span class="skill-icon">${icons.mail}</span>
                <div>
                  <p class="detail-label">Email</p>
                  <a href="mailto:${escapeHtml(portfolio.email)}">${escapeHtml(portfolio.email)}</a>
                </div>
              </div>
            </div>
            <form class="contact-card" id="contact-form">
              <div class="name-row">
                <label>
                  First Name
                  <input name="firstName" autocomplete="given-name" placeholder="John" required />
                </label>
                <label>
                  Last Name
                  <input name="lastName" autocomplete="family-name" placeholder="Doe" required />
                </label>
              </div>
              <label>
                Email
                <input type="email" name="email" autocomplete="email" placeholder="john@example.com" required />
              </label>
              <label>
                Subject
                <input name="subject" placeholder="Project Discussion" required />
              </label>
              <label>
                Message
                <textarea name="message" rows="5" placeholder="Tell me about your project..." required></textarea>
              </label>
              <button class="btn btn-primary btn-lg" type="submit">${icons.send} Send Message</button>
              <p class="form-note" id="form-note" role="status"></p>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="shell">
        <div class="footer-grid">
          <div>
            <p class="brand">${escapeHtml(portfolio.name)}</p>
            <p class="footer-line">${escapeHtml(portfolio.footerLine)}</p>
            <a class="icon-button" href="mailto:${escapeHtml(portfolio.email)}" aria-label="Email">${icons.mail}</a>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>${links.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h3>Services</h3>
            <ul>${services}</ul>
          </div>
        </div>
        <div class="footer-bar">
          <p>© ${new Date().getFullYear()} Portfolio. All rights reserved.</p>
          <p>Made with care, and coffee.</p>
        </div>
      </div>
    </footer>
  `;

  const nav = document.querySelector("#nav");
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector("#mobile-menu");

  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuButton.innerHTML = open ? icons.close : icons.menu;
    mobileMenu.hidden = !open;
    nav.classList.toggle("is-open", open);
  };

  menuButton.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 50);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelector("#contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const subject = data.get("subject");
    const body = [
      `Name: ${data.get("firstName")} ${data.get("lastName")}`,
      `Email: ${data.get("email")}`,
      "",
      data.get("message"),
    ].join("\n");
    const note = document.querySelector("#form-note");
    note.textContent = "Opening your email app with this message.";
    window.location.href = `mailto:${portfolio.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPortfolio();
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (target) target.scrollIntoView();
});
