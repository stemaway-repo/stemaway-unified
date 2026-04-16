/* global themePrefix */

import { apiInitializer } from "discourse/lib/api";
import { i18n } from "discourse-i18n";
import {
  normalizeAiviaHeaderThemePath,
  shouldUseAiviaHeaderTheme,
} from "../lib/aivia-header-theme";

const MENU_CONFIG = [
  {
    key: "use_cases",
    sections: [
      {
        key: "employers",
        items: ["full_time", "freelance", "internships", "talent_pipeline"],
      },
      {
        key: "candidates",
        items: ["verified"],
      },
      {
        key: "labs",
        items: ["project_mentorship"],
      },
    ],
  },
  {
    key: "the_tech",
    sections: [
      {
        key: "core",
        items: [
          "inside_aivia",
          "context_pack",
          "scenarios",
          "report_breakdown",
        ],
      },
    ],
  },
];

const MENU_ITEMS = {
  full_time: {
    href: "/aivia/full-time",
    titleKey: "aivia_header_nav.items.full_time.title",
    subtitleKey: "aivia_header_nav.items.full_time.subtitle",
  },
  freelance: {
    href: "/aivia/freelance",
    titleKey: "aivia_header_nav.items.freelance.title",
    subtitleKey: "aivia_header_nav.items.freelance.subtitle",
  },
  internships: {
    href: "/aivia/internships",
    titleKey: "aivia_header_nav.items.internships.title",
    subtitleKey: "aivia_header_nav.items.internships.subtitle",
  },
  talent_pipeline: {
    href: "/aivia/talent-pipeline",
    titleKey: "aivia_header_nav.items.talent_pipeline.title",
    subtitleKey: "aivia_header_nav.items.talent_pipeline.subtitle",
  },
  verified: {
    href: "/aivia/verified",
    titleKey: "aivia_header_nav.items.verified.title",
    subtitleKey: "aivia_header_nav.items.verified.subtitle",
  },
  project_mentorship: {
    href: "/aivia/project-mentorship",
    titleKey: "aivia_header_nav.items.project_mentorship.title",
    subtitleKey: "aivia_header_nav.items.project_mentorship.subtitle",
  },
  inside_aivia: {
    href: "/aivia/inside-aivia",
    titleKey: "aivia_header_nav.items.inside_aivia.title",
    subtitleKey: "aivia_header_nav.items.inside_aivia.subtitle",
  },
  context_pack: {
    href: "/aivia/context-pack",
    titleKey: "aivia_header_nav.items.context_pack.title",
    subtitleKey: "aivia_header_nav.items.context_pack.subtitle",
  },
  scenarios: {
    href: "/aivia/scenarios",
    titleKey: "aivia_header_nav.items.scenarios.title",
    subtitleKey: "aivia_header_nav.items.scenarios.subtitle",
  },
  report_breakdown: {
    href: "/aivia/report-breakdown",
    titleKey: "aivia_header_nav.items.report_breakdown.title",
    subtitleKey: "aivia_header_nav.items.report_breakdown.subtitle",
  },
};

function t(key) {
  return i18n(themePrefix(key));
}

function setDropdownState(dropdown, expanded) {
  const toggle = dropdown.querySelector(".aivia-header-nav__toggle");
  dropdown.classList.toggle("is-open", expanded);
  toggle?.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function closeAllDropdowns(root) {
  root
    .querySelectorAll(".aivia-header-nav__dropdown.is-open")
    .forEach((dropdown) => setDropdownState(dropdown, false));
}

function buildMenuItem(itemKey, currentPath) {
  const item = MENU_ITEMS[itemKey];
  const link = document.createElement("a");
  link.className = "aivia-header-nav__item";
  link.href = item.href;

  if (normalizeAiviaHeaderThemePath(item.href) === currentPath) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }

  const title = document.createElement("span");
  title.className = "aivia-header-nav__item-title";
  title.textContent = t(item.titleKey);

  const subtitle = document.createElement("span");
  subtitle.className = "aivia-header-nav__item-subtitle";
  subtitle.textContent = t(item.subtitleKey);

  const text = document.createElement("span");
  text.className = "aivia-header-nav__item-text";
  text.append(title, subtitle);

  link.append(text);
  return link;
}

function buildSection(sectionKey, items, currentPath) {
  const section = document.createElement("div");
  section.className = "aivia-header-nav__section";

  const label = document.createElement("div");
  label.className = "aivia-header-nav__section-label";
  label.textContent = t(`aivia_header_nav.sections.${sectionKey}`);
  section.append(label);

  items.forEach((itemKey) => {
    section.append(buildMenuItem(itemKey, currentPath));
  });

  return section;
}

function buildDropdown(menu, currentPath) {
  const dropdown = document.createElement("div");
  dropdown.className = "aivia-header-nav__dropdown";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "aivia-header-nav__toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-haspopup", "true");
  toggle.dataset.aiviaHeaderDropdown = menu.key;

  const label = document.createElement("span");
  label.className = "aivia-header-nav__toggle-label";
  label.textContent = t(`aivia_header_nav.${menu.key}.label`);

  const chevron = document.createElement("span");
  chevron.className = "aivia-header-nav__chevron";
  chevron.setAttribute("aria-hidden", "true");

  toggle.append(label, chevron);

  const panel = document.createElement("div");
  panel.className = "aivia-header-nav__menu";

  menu.sections.forEach((section) => {
    panel.append(buildSection(section.key, section.items, currentPath));
  });

  dropdown.append(toggle, panel);
  return dropdown;
}

function buildNav(currentPath) {
  const nav = document.createElement("div");
  nav.className = "aivia-header-nav";

  MENU_CONFIG.forEach((menu) => {
    nav.append(buildDropdown(menu, currentPath));
  });

  nav.addEventListener("click", (event) => {
    const toggle = event.target.closest(".aivia-header-nav__toggle");

    if (!toggle) {
      return;
    }

    const dropdown = toggle.closest(".aivia-header-nav__dropdown");
    const shouldOpen = !dropdown.classList.contains("is-open");

    closeAllDropdowns(nav);
    setDropdownState(dropdown, shouldOpen);
  });

  return nav;
}

function syncHeaderNav(api) {
  const headerIcons = document.querySelector(".d-header-icons");

  if (!headerIcons) {
    return;
  }

  headerIcons.querySelector(".aivia-header-nav")?.remove();

  const router = api.container.lookup("service:router");

  if (!shouldUseAiviaHeaderTheme(router)) {
    return;
  }

  const hamburger = Array.from(headerIcons.children).find(
    (child) =>
      child.classList.contains("hamburger-dropdown") ||
      child.querySelector(".hamburger-dropdown")
  );

  if (!hamburger) {
    return;
  }

  const currentPath = normalizeAiviaHeaderThemePath(
    router?.currentURL || window.location.pathname
  );
  const nav = buildNav(currentPath);

  headerIcons.insertBefore(nav, hamburger);
}

let globalHandlersBound = false;

function bindGlobalHandlers() {
  if (globalHandlersBound) {
    return;
  }

  document.addEventListener("click", (event) => {
    document.querySelectorAll(".aivia-header-nav").forEach((nav) => {
      if (!nav.contains(event.target)) {
        closeAllDropdowns(nav);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    document
      .querySelectorAll(".aivia-header-nav")
      .forEach((nav) => closeAllDropdowns(nav));
  });

  globalHandlersBound = true;
}

export default apiInitializer((api) => {
  const sync = () => {
    syncHeaderNav(api);
    requestAnimationFrame(() => syncHeaderNav(api));
  };

  bindGlobalHandlers();
  api.onPageChange(sync);
  sync();
});
