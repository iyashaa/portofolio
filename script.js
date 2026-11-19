const $ = (selector) => document.querySelector(selector);

const visualTemplates = {
  trend: '<svg viewBox="0 0 520 190" aria-hidden="true"><g class="mini-grid"><path d="M20 28H500M20 69H500M20 110H500M20 151H500"/></g><path class="mini-line mini-line-a" d="M20 143C72 130 74 92 124 106S187 148 226 89 286 70 321 91 370 119 407 62 455 47 500 30"/><path class="mini-line mini-line-b" d="M20 155C71 145 82 131 124 125S185 111 226 102 279 95 321 83 368 70 407 58 462 50 500 43"/></svg>',
  matrix: '<div class="matrix-plot" aria-hidden="true"><i class="tone-1"></i><i class="tone-2"></i><i class="tone-3"></i><i class="tone-2"></i><i class="tone-1"></i><i class="tone-2"></i><i class="tone-4"></i><i class="tone-3"></i><i class="tone-2"></i><i class="tone-1"></i><i class="tone-3"></i><i class="tone-3"></i><i class="tone-5"></i><i class="tone-2"></i><i class="tone-2"></i><i class="tone-2"></i><i class="tone-4"></i><i class="tone-2"></i><i class="tone-5"></i><i class="tone-1"></i><i class="tone-1"></i><i class="tone-2"></i><i class="tone-3"></i><i class="tone-1"></i><i class="tone-4"></i></div>',
  distribution: '<div class="distribution-plot" aria-hidden="true"><i style="--bar:24%"></i><i style="--bar:39%"></i><i style="--bar:54%"></i><i style="--bar:72%"></i><i style="--bar:93%"></i><i style="--bar:81%"></i><i style="--bar:64%"></i><i style="--bar:48%"></i><i style="--bar:31%"></i><i style="--bar:19%"></i><i style="--bar:12%"></i></div>'
};

const toolIcons = {
  python: "python.svg",
  javascript: "javascript.svg",
  pandas: "pandas.svg",
  numpy: "numpy.svg",
  matplotlib: "matplotlib.png",
  plotly: "plotly.svg",
  "scikit-learn": "scikitlearn.svg",
  tensorflow: "tensorflow.svg",
  xgboost: "xgboost.png",
  "gemini api": "googlegemini.svg",
  fastapi: "fastapi.svg",
  streamlit: "streamlit.svg",
  mysql: "mysql.svg",
  postgresql: "postgresql.svg",
  git: "git.svg",
  github: "github.svg",
  jupyter: "jupyter.svg",
  "google colab": "googlecolab.svg",
  keras: "keras.svg"
};

function setText(selector, value) {
  const element = $(selector);
  if (element && value !== undefined && value !== null) element.textContent = value;
}

function safeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function safeImageUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function safeProjectUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function makeExternalLink(label, value, className) {
  const url = safeProjectUrl(value);
  if (!url) return null;
  const link = document.createElement("a");
  link.className = className;
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;
  return link;
}

function createProjectVisual(project, index, slideIndex, onSlideChange) {
  const visual = document.createElement("div");
  visual.className = `project-visual visual-${project.visual || "trend"}`;
  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const slides = gallery.map((item) => typeof item === "string" ? { src: item, alt: project.title || "Project image" } : item)
    .filter((item) => item && safeImageUrl(item.src));
  const current = slides.length ? slides[slideIndex % slides.length] : null;

  if (current) {
    const image = document.createElement("img");
    image.className = "project-image";
    image.src = safeImageUrl(current.src);
    image.alt = current.alt || `${project.title || "Project"} screenshot`;
    image.loading = "lazy";
    visual.append(image);
    if (slides.length > 1) {
      const controls = document.createElement("div");
      controls.className = "gallery-controls";
      const previous = document.createElement("button");
      previous.type = "button";
      previous.className = "gallery-arrow";
      previous.setAttribute("aria-label", `Previous image for ${project.title || "project"}`);
      previous.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
      previous.addEventListener("click", () => onSlideChange((slideIndex - 1 + slides.length) % slides.length));
      const counter = document.createElement("span");
      counter.className = "gallery-counter";
      counter.textContent = `${slideIndex + 1} / ${slides.length}`;
      const next = document.createElement("button");
      next.type = "button";
      next.className = "gallery-arrow";
      next.setAttribute("aria-label", `Next image for ${project.title || "project"}`);
      next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
      next.addEventListener("click", () => onSlideChange((slideIndex + 1) % slides.length));
      controls.append(previous, counter, next);
      visual.append(controls);
    }
    return visual;
  }

  const visualLabel = document.createElement("span");
  visualLabel.className = "visual-label";
  visualLabel.textContent = project.chartLabel || "DATA VISUALIZATION";
  const chart = document.createElement("div");
  chart.className = "project-chart";
  chart.innerHTML = visualTemplates[project.visual] || visualTemplates.trend;
  const number = document.createElement("span");
  number.className = "project-number";
  number.textContent = String(index + 1).padStart(2, "0");
  visual.append(visualLabel, chart, number);
  return visual;
}

function renderProjects(projects = []) {
  const grid = $("#project-grid");
  grid.replaceChildren();
  const projectCount = $("#project-count");
  const featuredCount = projects.filter((project) => project.featured).length;
  projectCount.textContent = `${projects.length} ${projects.length === 1 ? "project" : "projects"} · ${featuredCount} featured`;

  projects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project";
    let slideIndex = 0;
    const media = document.createElement("div");
    media.className = "project-media";
    const updateVisual = () => {
      media.replaceChildren(createProjectVisual(project, index, slideIndex, (nextIndex) => {
        slideIndex = nextIndex;
        updateVisual();
      }));
    };
    updateVisual();

    const content = document.createElement("div");
    content.className = "project-content";

    const meta = document.createElement("div");
    meta.className = "project-meta";
    const category = document.createElement("span");
    category.textContent = project.category || "Data science";
    const badges = document.createElement("div");
    badges.className = "project-badges";
    if (project.featured) {
      const featured = document.createElement("span");
      featured.className = "project-badge is-featured";
      featured.textContent = "Featured";
      badges.append(featured);
    }
    if (project.status) {
      const status = document.createElement("span");
      status.className = "project-badge";
      status.textContent = project.status;
      badges.append(status);
    }
    meta.append(category, badges);

    const titleRow = document.createElement("div");
    titleRow.className = "project-title-row";
    const title = document.createElement("h3");
    title.textContent = project.title || "Project title";
    titleRow.append(title);

    const details = document.createElement("p");
    details.className = "project-details";
    const detailsText = [project.phase, project.role].filter(Boolean).join(" · ");
    details.textContent = detailsText;
    details.hidden = !detailsText;

    const links = document.createElement("div");
    links.className = "project-actions";
    const sourceLink = makeExternalLink("View source code", project.sourceUrl, "project-action");
    const demoLink = makeExternalLink("Live demo", project.demoUrl, "project-action project-action-primary");
    if (sourceLink) links.append(sourceLink);
    if (demoLink) links.append(demoLink);
    links.hidden = !sourceLink && !demoLink;

    if (project.role || project.phase) {
      const projectDetailsLabel = document.createElement("span");
      projectDetailsLabel.className = "visually-hidden";
      projectDetailsLabel.textContent = "Project details";
      details.prepend(projectDetailsLabel);
    }

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description || "";

    const tags = document.createElement("div");
    tags.className = "project-tags";
    (project.tags || []).forEach((label) => {
      const tag = document.createElement("span");
      tag.textContent = label;
      tags.append(tag);
    });

    content.append(meta, titleRow, details, description, tags, links);
    article.append(media, content);
    grid.append(article);
  });
}

function initThemeToggle() {
  const button = $("#theme-toggle");
  const root = document.documentElement;
  const storedTheme = (() => {
    try { return localStorage.getItem("portfolio-theme"); } catch { return null; }
  })();
  const initialTheme = storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    button.setAttribute("aria-pressed", String(theme === "dark"));
    const nextTheme = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    button.title = `Switch to ${nextTheme} mode`;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === "dark" ? "#141a19" : "#f5f7f6";
    if (persist) {
      try { localStorage.setItem("portfolio-theme", theme); } catch { /* Storage may be unavailable. */ }
    }
  }

  applyTheme(initialTheme);
  button.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });
}

function initMobileNavigation() {
  const header = $(".site-header");
  const button = $("#mobile-menu-toggle");
  const nav = $("#main-nav");

  function setMenuOpen(open) {
    header.classList.toggle("is-menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }

  button.addEventListener("click", () => {
    setMenuOpen(button.getAttribute("aria-expanded") !== "true");
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      button.focus();
    }
  });
  window.matchMedia("(min-width: 701px)").addEventListener("change", () => setMenuOpen(false));
}

function initScrollReveals() {
  const targets = [...document.querySelectorAll(
    ".site-header, .hero-copy, .hero-visual, .about-intro, .about-content, .section-heading, .journey-heading, .stack-heading, .contact-inner, .site-footer, .project, .approach-item, .stack-group, .journey-entry, .timeline-entry"
  )];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!targets.length || prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const directions = new Map([
    [".site-header", "down"],
    [".hero-copy", "left"],
    [".hero-visual", "right"],
    [".about-intro", "left"]
  ]);
  targets.forEach((target) => {
    target.dataset.reveal = [...directions].find(([selector]) => target.matches(selector))?.[1] || "up";
  });

  [".project", ".approach-item", ".stack-group", ".journey-entry", ".timeline-entry"].forEach((selector) => {
    document.querySelectorAll(selector).forEach((target, index) => {
      target.style.setProperty("--reveal-delay", `${Math.min(index * 75, 225)}ms`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });

  document.documentElement.classList.add("motion-ready");
  targets.forEach((target) => observer.observe(target));
}

function renderStack(groups = []) {
  const container = $("#stack-groups");
  container.replaceChildren();
  const tools = [...new Set(groups.flatMap((group) => group.tools || []).filter(Boolean))];
  if (!tools.length) return;

  const track = document.createElement("div");
  track.className = "stack-marquee-track";
  [false, true].forEach((isDuplicate) => {
    const group = document.createElement("div");
    group.className = "stack-marquee-group";
    group.setAttribute("role", "list");
    if (isDuplicate) group.setAttribute("aria-hidden", "true");
    tools.forEach((tool) => {
      const item = document.createElement("span");
      item.className = "stack-tool";
      item.setAttribute("role", "listitem");
      const iconSlug = toolIcons[tool.toLowerCase()];
      if (iconSlug) {
        const image = document.createElement("img");
        image.className = `stack-tool-icon${tool.toLowerCase() === "xgboost" ? " stack-tool-icon-wordmark" : ""}`;
        image.src = `assets/tech-icons/${iconSlug}`;
        image.alt = "";
        image.width = 18;
        image.height = 18;
        image.setAttribute("aria-hidden", "true");
        image.onerror = () => image.remove();
        item.append(image);
      }
      const label = document.createElement("span");
      label.textContent = tool;
      item.append(label);
      group.append(item);
    });
    track.append(group);
  });
  container.append(track);
}

function renderApproach(items = []) {
  const list = $("#approach-list");
  list.replaceChildren();
  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "approach-item";
    const number = document.createElement("span");
    number.className = "approach-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = item.title || "Step";
    const description = document.createElement("p");
    description.textContent = item.description || "";
    copy.append(heading, description);
    row.append(number, copy);
    list.append(row);
  });
}

function renderTimeline(selector, items = []) {
  const list = $(selector);
  list.replaceChildren();
  items.forEach((item) => {
    const entry = document.createElement("article");
    entry.className = "timeline-entry";
    const period = document.createElement("span");
    period.className = "timeline-period";
    period.textContent = item.period || "";
    const title = document.createElement("h4");
    title.textContent = item.title || "";
    const organization = document.createElement("p");
    organization.className = "timeline-organization";
    organization.textContent = item.organization || "";
    entry.append(period, title, organization);
    if (item.description) {
      const description = document.createElement("p");
      description.className = "timeline-description";
      description.textContent = item.description;
      entry.append(description);
    }
    list.append(entry);
  });
}

function renderJourney(items = []) {
  const list = $("#experience-list");
  list.replaceChildren();
  items.forEach((item) => {
    const entry = document.createElement("article");
    entry.className = "journey-entry";

    const top = document.createElement("div");
    top.className = "journey-entry-top";
    const identity = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title || "Experience";
    identity.append(title);
    if (item.organization) {
      const organization = document.createElement("p");
      organization.className = "journey-organization";
      organization.textContent = item.organization;
      identity.append(organization);
    }

    const meta = document.createElement("div");
    meta.className = "journey-entry-meta";
    if (item.period) {
      const period = document.createElement("span");
      period.textContent = item.period;
      meta.append(period);
    }
    const location = [item.location, item.workMode].filter(Boolean).join(" · ");
    if (location) {
      const place = document.createElement("span");
      place.className = "journey-location";
      place.textContent = location;
      meta.append(place);
    }
    top.append(identity, meta);
    entry.append(top);

    if (item.description) {
      const description = document.createElement("p");
      description.className = "journey-description";
      description.textContent = item.description;
      entry.append(description);
    }

    const skills = (item.skills || []).filter(Boolean);
    if (skills.length) {
      const skillRow = document.createElement("div");
      skillRow.className = "journey-skills";
      const label = document.createElement("span");
      label.className = "journey-skills-label";
      label.textContent = "Skills learned";
      const skillList = document.createElement("div");
      skillList.className = "journey-skill-list";
      skills.forEach((skill) => {
        const tag = document.createElement("span");
        tag.className = "journey-skill";
        tag.textContent = skill;
        skillList.append(tag);
      });
      skillRow.append(label, skillList);
      entry.append(skillRow);
    }

    list.append(entry);
  });
}

function renderPortfolio(data) {
  const profile = data.profile || {};
  const hero = data.hero || {};
  const about = data.about || {};
  const contact = data.contact || {};
  const email = profile.email && !profile.email.includes("example.com")
    ? safeUrl(`mailto:${profile.email}`)
    : "";

  setText("#profile-name", profile.name || "Ghiyyas Abiyasha Winardi");
  setText("#footer-name", profile.name || "Ghiyyas Abiyasha Winardi");
  setText("#profile-role", profile.role || "Data Scientist");
  setText("#hero-lead", hero.lead || "");
  setText("#profile-detail-role", profile.role || "Data Scientist");
  setText("#profile-status", hero.status || "");
  setText("#profile-focus", hero.focus || "");
  setText("#projects-intro", data.projectsIntro || "");
  setText("#experience-intro", data.experienceIntro || "");
  setText("#about-heading", about.heading || "");
  setText("#contact-heading", contact.heading || "");
  setText("#contact-copy", contact.copy || "");
  const specialties = $("#hero-specialties");
  specialties.replaceChildren();
  (hero.specialties || []).forEach((label) => {
    const tag = document.createElement("span");
    tag.className = "hero-tag";
    tag.textContent = label;
    specialties.append(tag);
  });

  const photoFrame = $("#profile-photo-frame");
  const photoUrl = safeImageUrl(profile.photo);
  if (photoUrl) {
    const photo = $("#profile-photo");
    photo.src = photoUrl;
    photo.alt = profile.photoAlt || `Portrait of ${profile.name || "the portfolio owner"}`;
    photoFrame.hidden = false;
    photo.addEventListener("error", () => { photoFrame.hidden = true; }, { once: true });
  } else {
    photoFrame.hidden = true;
  }

  ["#contact-email"].forEach((selector) => {
    const link = $(selector);
    if (email) {
      link.href = email;
      link.hidden = false;
    } else if (selector === "#contact-email") {
      link.hidden = true;
    } else {
      link.href = "#contact";
    }
  });
  if (email) setText("#contact-email", `${profile.email} ↗`);

  const resumeLink = $("#hero-resume");
  const resumeUrl = safeProjectUrl(profile.resumeUrl) || safeProjectUrl("assets/ghiyyas-resume.pdf");
  resumeLink.href = resumeUrl;
  resumeLink.download = "https://drive.google.com/uc?export=download&id=1Q_APEpfoMWp4x3Tgrkx-KuDjAMpPkSvF";
  resumeLink.hidden = false;

  renderProjects(data.projects);
  renderStack(data.stack);
  renderApproach(about.approach);
  const experience = data.experience || [];
  const education = data.education || [];
  const hasJourney = experience.length > 0 || education.length > 0;
  $("#journey").hidden = !hasJourney;
  $("#journey-nav").hidden = !hasJourney;
  $("#education-block").hidden = education.length === 0;
  renderJourney(experience);
  renderTimeline("#education-list", education);

  const paragraphs = $("#about-copy");
  paragraphs.replaceChildren();
  const aboutParagraphs = about.paragraphs || [];
  aboutParagraphs.forEach((copy, index) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = copy;
    paragraph.hidden = index > 0;
    paragraphs.append(paragraph);
  });
  const aboutToggle = $("#about-toggle");
  aboutToggle.hidden = aboutParagraphs.length < 2;
  aboutToggle.setAttribute("aria-expanded", "false");
  aboutToggle.querySelector("span").textContent = "Show more";
  aboutToggle.onclick = () => {
    const expanded = aboutToggle.getAttribute("aria-expanded") !== "true";
    aboutToggle.setAttribute("aria-expanded", String(expanded));
    aboutToggle.querySelector("span").textContent = expanded ? "Show less" : "Show more";
    paragraphs.querySelectorAll("p").forEach((paragraph, index) => {
      paragraph.hidden = !expanded && index > 0;
    });
  };

  const socials = $("#social-links");
  socials.replaceChildren();
  (contact.socials || []).forEach((social) => {
    const url = safeUrl(social.url);
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    if (!url.startsWith("tel:")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    link.textContent = social.label;
    socials.append(link);
  });
}

initThemeToggle();
initMobileNavigation();

fetch("portfolio.json")
  .then((response) => {
    if (!response.ok) throw new Error("portfolio.json not found");
    return response.json();
  })
  .then((data) => {
    renderPortfolio(data);
    initScrollReveals();
  })
  .catch(() => {
    $("#load-error").hidden = false;
  });
