const portfolio = {
  name: "Jackson Ogbu",
  role: "Product Manager, UI/UX Designer, and Full Stack Developer. I create thoughtful digital products through strategy, design, and technology.",
  email: "jacskonogbu100@gmail.com",
  about: [
    "I'm a product manager, UI/UX designer, and full stack developer. I work across the life of a product: the problem, the interface, and the software behind it.",
    "Strategy, design, and engineering stay in one conversation. The result should be clear for the people using it and solid for the people shipping it.",
    "I'm open to collaborations that need product thinking, interface design, and a full-stack build — from the first brief through to something people can use.",
  ],
  skills: [
    {
      title: "Product Strategy",
      description:
        "Product discovery, problem framing, roadmaps, and writing the brief so the team knows what to build and why.",
      icon: "compass",
    },
    {
      title: "UI/UX Design",
      description:
        "Interface design, user flows, prototypes, and design critique for products that feel considered.",
      icon: "pen",
    },
    {
      title: "Full-Stack Development",
      description:
        "JavaScript, React, Node.js, and APIs — building the product, not only the picture of it.",
      icon: "code",
    },
    {
      title: "Collaboration",
      description:
        "Working across product, design, and engineering so decisions survive contact with the build.",
      icon: "users",
    },
  ],
  focuses: [
    { value: "Product", label: "Strategy" },
    { value: "Design", label: "UI / UX" },
    { value: "Code", label: "Full stack" },
    { value: "Launch", label: "Delivery" },
  ],
  projectsIntro:
    "Working builds are listed first. The last three cards are placeholders.",
  projects: [
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
    {
      title: "Northline",
      description:
        "Shaped a regional transit brief into a phone booking flow with fewer abandoned trips.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      tags: ["Strategy", "Design", "Mobile", "User flows"],
    },
    {
      title: "Atelier",
      description:
        "Designed and built a small storefront where a ceramics studio can publish work and take orders.",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      tags: ["Design", "Engineering", "React", "Commerce"],
    },
    {
      title: "Fieldnote",
      description:
        "Built a research space that keeps interview notes next to the product decisions they changed.",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      tags: ["Strategy", "Engineering", "Research", "Product"],
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
  compass: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5l-1.2 3.8-3.8 1.2 1.2-3.8z"/></svg>',
  pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l4.2-1.1L19 8.1 15.9 5 5.1 15.8z"/><path d="M13.8 7.1l3.1 3.1"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/></svg>',
  users: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-2.6 2.8-4 5.5-4s4.9 1.4 5.5 4"/><circle cx="17" cy="9" r="2.2"/><path d="M16.2 15c1.8.3 3.2 1.4 3.8 4"/></svg>',
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

  const skills = portfolio.skills
    .map(
      (skill) => `
        <article class="skill-card">
          <div class="skill-icon">${icons[skill.icon] || ""}</div>
          <h3>${escapeHtml(skill.title)}</h3>
          <p>${escapeHtml(skill.description)}</p>
        </article>
      `
    )
    .join("");

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
          <div class="about-grid">
            <div>
              <h2 class="section-title">About Me</h2>
              <div class="about-copy">${about}</div>
            </div>
            <div class="skill-grid">${skills}</div>
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

document.addEventListener("DOMContentLoaded", renderPortfolio);
