/* Mark document as JS-capable immediately so reveal CSS activates */
document.documentElement.classList.add('js');

const translations = {
  en: {
    skip: "Skip to main content",
    home: "Home",
    courses: "Courses",
    resources: "Resources",
    contact: "Contact",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    theme: "Change color theme",
    eyebrow: "Math, technology, and better questions",
    heroCopy: "I’m Mr. Mendez. This is our classroom hub for weekly assignments, course resources, and the support you need to keep moving forward.",
    findClass: "Find your class",
    contactMe: "Contact Mr. Mendez",
    announcement: "Class announcement",
    classesTitle: "Choose your course",
    classesCopy: "Assignments and resources are organized by course, not by student name.",
    openCourse: "Open course →",
    resourcesTitle: "Tools for learning",
    resourcesCopy: "Reliable places to practice, graph, review, and submit work.",
    viewResources: "View all resources →",
    graphHint: "Drag orange b or blue m. The equation updates.",
    graphSlopePoint: "Slope handle. Use the up and down arrow keys.",
    graphInterceptPoint: "Y-intercept handle. Use the up and down arrow keys.",
    graphReset: "Reset",
    currentWeek: "Current week",
    priorWeeks: "Previous weeks",
    assignment: "Open assignment ↗",
    noWork: "No assignments have been posted for this week yet.",
    loadError: "Course information could not load. Refresh the page or check Google Classroom.",
    courseUpdated: "Course content is updated weekly.",
    keyInfoEnglish: "Weekly assignment details remain in English.",
    response: "I respond to district email during school days. Please allow up to one school day for a reply.",
    privacyTitle: "Student privacy comes first",
    privacyCopy: "This public website never posts student names, student contact information, grades, or Google Classroom join codes.",
    emailTitle: "District email",
    emailCopy: "The best public way for students, families, and colleagues to reach me.",
    backHome: "Back to home",
    footer: "Classroom hub for Mr. Mendez",
    bellSchedule: "Bell schedule",
    wednesdayScheduleTitle: "Wednesday late-start schedule",
    wednesdayScheduleCopy: "The first day uses the shorter Wednesday schedule. Save this page for quick reference.",
    officialSchedule: "Official CCHS schedule ↗",
    firstDaySchedule: "Wednesday, August 5, 2026",
    lateStartNote: "Late start · Periods are 43–46 minutes",
    period1: "Period 1", period2: "Period 2", period3: "Period 3", period4: "Period 4", period5: "Period 5", period6: "Period 6", period7: "Period 7", lunch: "Lunch",
    phonePolicyTitle: "CCHS phone policy",
    phonePolicyCopy: "During instructional time, cell phones, earbuds/headphones, smart watches, AI glasses, and other personal electronic devices must be out of sight and silenced unless the teacher authorizes them for an academic purpose.",
    readDistrictPolicy: "Read the district announcement ↗",
    scheduleCardTitle: "Bell schedule",
    scheduleCardCopy: "Check the current CCHS schedule, including Wednesday late-start times and special schedules.",
    openBellSchedule: "Open CCHS bell schedule ↗",
    languageName: "ES"
  },
  es: {
    skip: "Saltar al contenido principal",
    home: "Inicio",
    courses: "Cursos",
    resources: "Recursos",
    contact: "Contacto",
    menuOpen: "Abrir menú",
    menuClose: "Cerrar menú",
    theme: "Cambiar el tema de color",
    eyebrow: "Matemáticas, tecnología y mejores preguntas",
    heroCopy: "Soy el Sr. Mendez. Este es nuestro centro de clase para tareas semanales, recursos del curso y el apoyo necesario para seguir avanzando.",
    findClass: "Encuentra tu clase",
    contactMe: "Contactar al Sr. Mendez",
    announcement: "Anuncio de la clase",
    classesTitle: "Elige tu curso",
    classesCopy: "Las tareas y los recursos están organizados por curso, no por nombre del estudiante.",
    openCourse: "Abrir curso →",
    resourcesTitle: "Herramientas para aprender",
    resourcesCopy: "Lugares confiables para practicar, graficar, repasar y entregar trabajos.",
    viewResources: "Ver todos los recursos →",
    graphHint: "Arrastra b naranja o m azul. La ecuación se actualiza.",
    graphSlopePoint: "Control de la pendiente. Usa las flechas arriba y abajo.",
    graphInterceptPoint: "Control de la intersección con y. Usa las flechas arriba y abajo.",
    graphReset: "Restablecer",
    currentWeek: "Semana actual",
    priorWeeks: "Semanas anteriores",
    assignment: "Abrir tarea ↗",
    noWork: "Todavía no se han publicado tareas para esta semana.",
    loadError: "No se pudo cargar la información del curso. Actualiza la página o revisa Google Classroom.",
    courseUpdated: "El contenido del curso se actualiza semanalmente.",
    keyInfoEnglish: "Los detalles de las tareas semanales permanecen en inglés.",
    response: "Respondo al correo del distrito durante los días escolares. Por favor, espere hasta un día escolar para recibir una respuesta.",
    privacyTitle: "La privacidad estudiantil es primero",
    privacyCopy: "Este sitio público nunca publica nombres, datos de contacto, calificaciones ni códigos de acceso de Google Classroom.",
    emailTitle: "Correo del distrito",
    emailCopy: "La mejor manera pública para que estudiantes, familias y colegas se comuniquen conmigo.",
    backHome: "Volver al inicio",
    footer: "Centro de clase del Sr. Mendez",
    bellSchedule: "Horario de campana",
    wednesdayScheduleTitle: "Horario de inicio tardío del miércoles",
    wednesdayScheduleCopy: "El primer día usa el horario corto del miércoles. Guarda esta página para consultarla rápidamente.",
    officialSchedule: "Horario oficial de CCHS ↗",
    firstDaySchedule: "Miércoles 5 de agosto de 2026",
    lateStartNote: "Inicio tardío · Los períodos duran 43–46 minutos",
    period1: "Período 1", period2: "Período 2", period3: "Período 3", period4: "Período 4", period5: "Período 5", period6: "Período 6", period7: "Período 7", lunch: "Almuerzo",
    phonePolicyTitle: "Política de teléfonos de CCHS",
    phonePolicyCopy: "Durante el tiempo de instrucción, los teléfonos celulares, audífonos, relojes inteligentes, lentes inteligentes y otros dispositivos electrónicos personales deben estar guardados y en silencio, a menos que el maestro los autorice para un propósito académico.",
    readDistrictPolicy: "Leer el anuncio del distrito ↗",
    scheduleCardTitle: "Horario de campana",
    scheduleCardCopy: "Consulta el horario actual de CCHS, incluidos los horarios cortos de los miércoles y los horarios especiales.",
    openBellSchedule: "Abrir el horario de CCHS ↗",
    languageName: "EN"
  }
};

const state = {
  language: localStorage.getItem("mendez-language") || "en",
  theme: localStorage.getItem("mendez-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  site: null,
  course: null
};

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", translations[state.language].theme);
    button.innerHTML = state.theme === "dark"
      ? '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>'
      : '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>';
  });
}

function applyLanguage() {
  const copy = translations[state.language];
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = copy[element.dataset.i18n];
    if (value) element.innerHTML = value;
  });
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.textContent = copy.languageName;
    button.setAttribute("aria-label", state.language === "en" ? "Ver información clave en español" : "View key information in English");
  });
  document.querySelectorAll("[data-menu-toggle]").forEach((button) => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-label", expanded ? copy.menuClose : copy.menuOpen);
  });
  document.querySelectorAll("[data-math-interactive] .p-dot").forEach((point) => { point.setAttribute("aria-label", copy.graphSlopePoint); });
  document.querySelectorAll("[data-math-interactive] .y-dot").forEach((point) => { point.setAttribute("aria-label", copy.graphInterceptPoint); });
  if (state.site) {
    document.querySelectorAll("[data-announcement-text]").forEach((element) => {
      element.textContent = state.language === "es" ? state.site.announcementEs : state.site.announcement;
    });
    renderCourses(state.site.courses);
  }
  if (state.course) {
    document.querySelectorAll("[data-course-name]").forEach((element) => { element.textContent = state.language === "es" ? state.course.nameEs : state.course.name; });
    document.querySelectorAll("[data-course-description]").forEach((element) => { element.textContent = state.language === "es" ? state.course.descriptionEs : state.course.description; });
  }
  applyTheme();
}

function setupControls() {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("mendez-theme", state.theme);
      applyTheme();
    });
  });

  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = state.language === "en" ? "es" : "en";
      localStorage.setItem("mendez-language", state.language);
      applyLanguage();
    });
  });

  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.getElementById("mobile-navigation");
  if (!menuButton || !mobileNav) return;
  const links = [...mobileNav.querySelectorAll("a")];

  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    mobileNav.classList.toggle("open", open);
    mobileNav.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    applyLanguage();
    if (open) links[0]?.focus();
    else menuButton.focus();
  };

  menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  links.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") setMenu(false);
    if (event.key === "Tab" && menuButton.getAttribute("aria-expanded") === "true") {
      const focusable = [menuButton, ...links];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
}

function safeExternalLink(url) {
  try {
    const value = new URL(url, location.href);
    return ["https:", "http:"].includes(value.protocol) ? value.href : null;
  } catch { return null; }
}

function renderCourses(courses) {
  document.querySelectorAll("[data-course-grid]").forEach((grid) => {
    grid.innerHTML = courses.map((course, index) => `
      <a class="course-card reveal" href="${encodeURI(course.url)}" style="transition-delay:${index * 80}ms">
        <span class="course-number" aria-hidden="true">${course.shortLabel}</span>
        <h3>${state.language === "es" ? course.nameEs : course.name}</h3>
        <p>${state.language === "es" ? course.descriptionEs : course.description}</p>
        <span class="card-action" data-i18n="openCourse">${translations[state.language].openCourse}</span>
      </a>`).join("");
  });
}

function formatRange(week) {
  if (!week.startDate || !week.endDate) return "";
  const options = { month: "short", day: "numeric", timeZone: "UTC" };
  return `${new Date(`${week.startDate}T00:00:00Z`).toLocaleDateString("en-US", options)}–${new Date(`${week.endDate}T00:00:00Z`).toLocaleDateString("en-US", options)}`;
}

function renderDay(day) {
  const url = day.link ? safeExternalLink(day.link) : null;
  return `<li class="day">
    <div class="day-date">${day.dayLabel}<br>${day.dateLabel || ""}</div>
    <div><h3>${day.title}</h3>${day.summary ? `<p>${day.summary}</p>` : ""}</div>
    ${url ? `<a class="assignment-link" href="${url}" target="_blank" rel="noopener noreferrer" data-i18n="assignment">${translations[state.language].assignment}</a>` : ""}
  </li>`;
}

function renderWeek(week, current = false) {
  const days = week.days?.length ? week.days.map(renderDay).join("") : `<li class="empty-state" data-i18n="noWork">${translations[state.language].noWork}</li>`;
  return `<article class="week-card">
    <header class="week-header"><div><h2>${week.label}</h2>${current ? `<span class="pill pill-current" data-i18n="currentWeek">${translations[state.language].currentWeek}</span>` : ""}</div><span class="week-dates">${formatRange(week)}</span></header>
    <ul class="day-list">${days}</ul>
  </article>`;
}

async function loadSiteContent() {
  try {
    const site = await fetchJson("data/site.json");
    state.site = site;
    document.querySelectorAll("[data-announcement-text]").forEach((element) => { element.textContent = state.language === "es" ? site.announcementEs : site.announcement; });
    document.querySelectorAll("[data-school-email]").forEach((element) => {
      element.textContent = site.contact.email;
      if (element.tagName === "A") element.href = `mailto:${site.contact.email}`;
    });
    renderCourses(site.courses);
  } catch (error) {
    console.error(error);
    document.querySelectorAll('[data-course-grid]').forEach((grid) => {
      grid.innerHTML = `<div class="error-state" role="alert">${translations[state.language].loadError}</div>`;
    });
  }
}

async function loadCourse() {
  const root = document.querySelector("[data-course-slug]");
  if (!root) return;
  const slug = root.dataset.courseSlug;
  try {
    const course = await fetchJson(`data/courses/${slug}.json`);
    state.course = course;
    document.title = `${course.name} | Mr. Mendez Math`;
    document.querySelectorAll("[data-course-name]").forEach((element) => { element.textContent = state.language === "es" ? course.nameEs : course.name; });
    document.querySelectorAll("[data-course-description]").forEach((element) => { element.textContent = state.language === "es" ? course.descriptionEs : course.description; });
    const current = course.weeks.find((week) => week.status === "current");
    const archive = course.weeks.filter((week) => week.status === "archived").sort((a, b) => b.startDate.localeCompare(a.startDate));
    const currentRoot = document.querySelector("[data-current-week]");
    const archiveRoot = document.querySelector("[data-archive-weeks]");
    currentRoot.innerHTML = current ? renderWeek(current, true) : `<div class="empty-state" data-i18n="noWork">${translations[state.language].noWork}</div>`;
    archiveRoot.innerHTML = archive.length ? archive.map((week) => renderWeek(week)).join("") : `<div class="empty-state">Prior weeks will appear here.</div>`;
  } catch (error) {
    console.error(error);
    document.querySelector("[data-current-week]").innerHTML = `<div class="error-state" role="alert" data-i18n="loadError">${translations[state.language].loadError}</div>`;
  }
}

function setupReveal() {
  /* Graceful fallback for very old browsers */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); /* fire once, then stop watching */
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.reveal:not(.is-revealed)').forEach((el) => observer.observe(el));
}

function setupMathInteraction() {
  const card = document.querySelector("[data-math-interactive]");
  const slopeHandle = card?.querySelector(".p-dot");
  const interceptHandle = card?.querySelector(".y-dot");
  const equation = card?.querySelector("[data-equation]");
  const slopeReadout = card?.querySelector("[data-slope-readout]");
  const interceptReadout = card?.querySelector("[data-intercept-readout]");
  const resetButton = card?.querySelector("[data-math-reset]");
  if (!card || !slopeHandle || !interceptHandle || !equation || !slopeReadout || !interceptReadout || !resetButton) return;

  const limits = Object.freeze({
    interceptMin: -2,
    interceptMax: 2,
    slopeMin: -1.25,
    slopeMax: 1.25,
    interceptStep: 0.5,
    slopeStep: 0.25,
    pointXUnits: 3,
    margin: 20
  });
  const graph = { slope: 0.75, intercept: 0 };
  let frame = 0;
  let activeHandle = null;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const snap = (value, step) => Math.round(value / step) * step;
  const formatNumber = (value) => {
    const safeValue = Math.abs(value) < 0.005 ? 0 : value;
    return Number(safeValue.toFixed(2)).toString();
  };

  const geometry = () => {
    const bounds = card.getBoundingClientRect();
    const unit = clamp(Math.min(bounds.width / 11, bounds.height / 9), 24, 34);
    const axisX = bounds.width * 0.33;
    const zeroY = bounds.height * 0.58;
    const mathYMax = (zeroY - limits.margin) / unit;
    const mathYMin = (zeroY - (bounds.height - limits.margin)) / unit;
    return { bounds, unit, axisX, zeroY, mathYMin, mathYMax };
  };

  const render = () => {
    const plot = geometry();
    const interceptMin = Math.max(limits.interceptMin, plot.mathYMin);
    const interceptMax = Math.min(limits.interceptMax, plot.mathYMax);
    graph.intercept = clamp(snap(graph.intercept, limits.interceptStep), interceptMin, interceptMax);

    const rawSlopeMin = Math.max(limits.slopeMin, (plot.mathYMin - graph.intercept) / limits.pointXUnits);
    const rawSlopeMax = Math.min(limits.slopeMax, (plot.mathYMax - graph.intercept) / limits.pointXUnits);
    const slopeMin = Math.ceil(rawSlopeMin / limits.slopeStep) * limits.slopeStep;
    const slopeMax = Math.floor(rawSlopeMax / limits.slopeStep) * limits.slopeStep;
    graph.slope = clamp(snap(graph.slope, limits.slopeStep), slopeMin, slopeMax);

    const interceptY = plot.zeroY - graph.intercept * plot.unit;
    const pointX = plot.axisX + limits.pointXUnits * plot.unit;
    const pointMathY = graph.intercept + graph.slope * limits.pointXUnits;
    const pointY = plot.zeroY - pointMathY * plot.unit;
    const riseTop = Math.min(interceptY, pointY);
    const riseHeight = Math.abs(interceptY - pointY);

    const leftMathX = -plot.axisX / plot.unit;
    const rightMathX = (plot.bounds.width - plot.axisX) / plot.unit;
    const lineStartY = plot.zeroY - (graph.intercept + graph.slope * leftMathX) * plot.unit;
    const lineEndY = plot.zeroY - (graph.intercept + graph.slope * rightMathX) * plot.unit;
    const lineDeltaY = lineEndY - lineStartY;

    card.style.setProperty("--grid-size", `${plot.unit}px`);
    card.style.setProperty("--axis-x", `${plot.axisX}px`);
    card.style.setProperty("--zero-y", `${plot.zeroY}px`);
    card.style.setProperty("--intercept-y", `${interceptY}px`);
    card.style.setProperty("--point-x", `${pointX}px`);
    card.style.setProperty("--point-y", `${pointY}px`);
    card.style.setProperty("--run-width", `${pointX - plot.axisX}px`);
    card.style.setProperty("--rise-top", `${riseTop}px`);
    card.style.setProperty("--rise-height", `${riseHeight}px`);
    card.style.setProperty("--line-start-y", `${lineStartY}px`);
    card.style.setProperty("--line-length", `${Math.hypot(plot.bounds.width, lineDeltaY)}px`);
    card.style.setProperty("--line-angle", `${Math.atan2(lineDeltaY, plot.bounds.width)}rad`);

    const slopeText = formatNumber(graph.slope);
    const interceptText = formatNumber(graph.intercept);
    const interceptSign = graph.intercept < 0 ? "−" : "+";
    equation.textContent = `y = ${slopeText}x ${interceptSign} ${formatNumber(Math.abs(graph.intercept))}`;
    slopeReadout.textContent = `m = Δy / Δx = ${slopeText}`;
    interceptReadout.textContent = `b = ${interceptText}`;

    slopeHandle.setAttribute("aria-valuemin", formatNumber(slopeMin));
    slopeHandle.setAttribute("aria-valuemax", formatNumber(slopeMax));
    slopeHandle.setAttribute("aria-valuenow", slopeText);
    slopeHandle.setAttribute("aria-valuetext", `m = ${slopeText}`);
    interceptHandle.setAttribute("aria-valuemin", formatNumber(interceptMin));
    interceptHandle.setAttribute("aria-valuemax", formatNumber(interceptMax));
    interceptHandle.setAttribute("aria-valuenow", interceptText);
    interceptHandle.setAttribute("aria-valuetext", `b = ${interceptText}`);
  };

  const updateFromPointer = (clientY) => {
    const plot = geometry();
    const localY = clamp(clientY - plot.bounds.top, limits.margin, plot.bounds.height - limits.margin);
    const mathY = (plot.zeroY - localY) / plot.unit;
    if (activeHandle === interceptHandle) graph.intercept = snap(mathY, limits.interceptStep);
    if (activeHandle === slopeHandle) graph.slope = snap((mathY - graph.intercept) / limits.pointXUnits, limits.slopeStep);
    render();
  };

  const queuePointerUpdate = (event) => {
    const clientY = event.clientY;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => updateFromPointer(clientY));
  };

  const startDragging = (handle, event) => {
    activeHandle = handle;
    handle.classList.add("is-active");
    handle.setPointerCapture(event.pointerId);
    card.classList.add("is-interacting");
    queuePointerUpdate(event);
  };

  interceptHandle.addEventListener("pointerdown", (event) => startDragging(interceptHandle, event));
  slopeHandle.addEventListener("pointerdown", (event) => startDragging(slopeHandle, event));
  card.addEventListener("pointermove", (event) => {
    if (activeHandle) queuePointerUpdate(event);
  });
  card.addEventListener("mousemove", (event) => {
    if (activeHandle) queuePointerUpdate(event);
  });
  const stopDragging = (event) => {
    if (!activeHandle) return;
    const handle = activeHandle;
    activeHandle = null;
    handle.classList.remove("is-active");
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    card.classList.remove("is-interacting");
  };
  [interceptHandle, slopeHandle].forEach((handle) => {
    handle.addEventListener("pointerup", stopDragging);
    handle.addEventListener("pointercancel", stopDragging);
    handle.addEventListener("lostpointercapture", () => {
      handle.classList.remove("is-active");
      activeHandle = null;
      card.classList.remove("is-interacting");
    });
    handle.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowRight", "ArrowUp"].includes(event.key) ? 1 : -1;
      if (handle === interceptHandle) {
        if (event.key === "Home") graph.intercept = limits.interceptMin;
        else if (event.key === "End") graph.intercept = limits.interceptMax;
        else graph.intercept += direction * limits.interceptStep;
      } else {
        if (event.key === "Home") graph.slope = limits.slopeMin;
        else if (event.key === "End") graph.slope = limits.slopeMax;
        else graph.slope += direction * limits.slopeStep;
      }
      render();
    });
  });

  resetButton.addEventListener("click", () => {
    graph.slope = 0.75;
    graph.intercept = 0;
    render();
  });

  if ("ResizeObserver" in window) new ResizeObserver(render).observe(card);
  else window.addEventListener("resize", render, { passive: true });
  render();
}

function setYear() {
  document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });
}

document.addEventListener("DOMContentLoaded", async () => {
  applyTheme();
  applyLanguage();
  setupControls();
  setupMathInteraction();
  setYear();
  setupReveal(); /* catch static .reveal elements already in DOM (hero, etc.) */
  await Promise.all([loadSiteContent(), loadCourse()]);
  applyLanguage();
  setupReveal(); /* catch .reveal elements added by async content (course cards, etc.) */
});
