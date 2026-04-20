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
        items: ["hiring", "freelance", "internships"],
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
  hiring: {
    href: "/hiring",
    titleKey: "aivia_header_nav.items.hiring.title",
    subtitleKey: "aivia_header_nav.items.hiring.subtitle",
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
  my_aivia_evaluations: {
    href: "/my/aivia-dashboard",
    titleKey: "aivia_header_nav.items.my_aivia_evaluations.title",
    subtitleKey: "aivia_header_nav.items.my_aivia_evaluations.subtitle",
  },
  my_aivia_mentorship: {
    href: "/my/aivia-dashboard/mentorship",
    titleKey: "aivia_header_nav.items.my_aivia_mentorship.title",
    subtitleKey: "aivia_header_nav.items.my_aivia_mentorship.subtitle",
  },
  my_aivia_resume: {
    href: "/my/resume",
    titleKey: "aivia_header_nav.items.my_aivia_resume.title",
    subtitleKey: "aivia_header_nav.items.my_aivia_resume.subtitle",
  },
  my_aivia_discover_talent: {
    href: "/my/aivia-talent/search",
    titleKey: "aivia_header_nav.items.my_aivia_discover_talent.title",
    subtitleKey: "aivia_header_nav.items.my_aivia_discover_talent.subtitle",
  },
  my_aivia_customize_evaluation: {
    href: "/my/aivia-talent/prescreen",
    titleKey: "aivia_header_nav.items.my_aivia_customize_evaluation.title",
    subtitleKey:
      "aivia_header_nav.items.my_aivia_customize_evaluation.subtitle",
  },
  my_aivia_generate_questions: {
    href: "/my/aivia-talent/align",
    titleKey: "aivia_header_nav.items.my_aivia_generate_questions.title",
    subtitleKey: "aivia_header_nav.items.my_aivia_generate_questions.subtitle",
  },
  my_aivia_start_cohort: {
    href: "/my/aivia-talent/cohort",
    titleKey: "aivia_header_nav.items.my_aivia_start_cohort.title",
    subtitleKey: "aivia_header_nav.items.my_aivia_start_cohort.subtitle",
    badgeKey: "aivia_header_nav.labels.coming_soon",
    disabled: true,
  },
};

const SVG_NS = "http://www.w3.org/2000/svg";

function t(key) {
  return i18n(themePrefix(key));
}

function createMenuIcon() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.85");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  return svg;
}

function appendSvgShape(svg, tagName, attributes) {
  const node = document.createElementNS(SVG_NS, tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });

  svg.append(node);
}

function buildCompassIcon() {
  const svg = createMenuIcon();
  appendSvgShape(svg, "circle", { cx: "12", cy: "12", r: "8.5" });
  appendSvgShape(svg, "path", { d: "M12 6.8l2.5 5.2L12 17.2 9.5 12 12 6.8Z" });
  appendSvgShape(svg, "path", { d: "M12 6.8V17.2" });
  return svg;
}

function buildLayersIcon() {
  const svg = createMenuIcon();
  appendSvgShape(svg, "path", { d: "M12 4 3.5 8.5 12 13 20.5 8.5 12 4Z" });
  appendSvgShape(svg, "path", { d: "M5.3 13 12 16.5 18.7 13" });
  appendSvgShape(svg, "path", { d: "M5.3 17 12 20.5 18.7 17" });
  return svg;
}

function buildBriefcaseIcon() {
  const svg = createMenuIcon();
  appendSvgShape(svg, "rect", {
    x: "4",
    y: "7",
    width: "16",
    height: "12",
    rx: "2",
    ry: "2",
  });
  appendSvgShape(svg, "path", {
    d: "M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7",
  });
  appendSvgShape(svg, "path", { d: "M4 11.5h16" });
  return svg;
}

function buildToggleIcon(menuKey) {
  switch (menuKey) {
    case "use_cases":
      return buildCompassIcon();
    case "the_tech":
      return buildLayersIcon();
    case "my_aivia":
      return buildBriefcaseIcon();
  }
}

function getMyAiviaFeatureAccess(currentUser) {
  const serializedAccess = currentUser?.aivia_analytics_feature_access;

  if (serializedAccess && typeof serializedAccess === "object") {
    return {
      search: !!serializedAccess.search || !!serializedAccess.performance,
      prescreen: !!serializedAccess.prescreen,
      align: !!serializedAccess.align || !!serializedAccess.performance,
      generate: !!serializedAccess.generate,
    };
  }

  return {
    search: false,
    prescreen: false,
    align: false,
    generate: false,
  };
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
  const link = document.createElement(item.disabled ? "div" : "a");
  link.className = "aivia-header-nav__item";

  if (item.disabled) {
    link.classList.add("is-disabled");
    link.setAttribute("aria-disabled", "true");
  } else {
    link.href = item.href;
  }

  if (
    !item.disabled &&
    normalizeAiviaHeaderThemePath(item.href) === currentPath
  ) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }

  const titleRow = document.createElement("span");
  titleRow.className = "aivia-header-nav__item-title-row";

  const title = document.createElement("span");
  title.className = "aivia-header-nav__item-title";
  title.textContent = t(item.titleKey);

  titleRow.append(title);

  if (item.badgeKey) {
    const badge = document.createElement("span");
    badge.className = "aivia-header-nav__item-badge";
    badge.textContent = t(item.badgeKey);
    titleRow.append(badge);
  }

  const subtitle = document.createElement("span");
  subtitle.className = "aivia-header-nav__item-subtitle";
  subtitle.textContent = t(item.subtitleKey);

  const text = document.createElement("span");
  text.className = "aivia-header-nav__item-text";
  text.append(titleRow, subtitle);

  link.append(text);
  return link;
}

function buildSection(sectionKey, items, currentPath) {
  const section = document.createElement("div");
  section.className = "aivia-header-nav__section";

  if (sectionKey) {
    const label = document.createElement("div");
    label.className = "aivia-header-nav__section-label";
    label.textContent = t(`aivia_header_nav.sections.${sectionKey}`);
    section.append(label);
  }

  items.forEach((itemKey) => {
    section.append(buildMenuItem(itemKey, currentPath));
  });

  return section;
}

function buildDropdown(menu, currentPath, options = {}) {
  const dropdown = document.createElement("div");
  dropdown.className = "aivia-header-nav__dropdown";

  if (options.className) {
    dropdown.classList.add(options.className);
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "aivia-header-nav__toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-haspopup", "true");
  toggle.setAttribute("aria-label", t(`aivia_header_nav.${menu.key}.label`));
  toggle.dataset.aiviaHeaderDropdown = menu.key;

  const icon = buildToggleIcon(menu.key);

  if (icon) {
    const iconWrapper = document.createElement("span");
    iconWrapper.className = "aivia-header-nav__toggle-icon";
    iconWrapper.append(icon);
    toggle.append(iconWrapper);
  }

  const label = document.createElement("span");
  label.className = "aivia-header-nav__toggle-label";
  label.textContent = t(`aivia_header_nav.${menu.key}.label`);

  const chevron = document.createElement("span");
  chevron.className = "aivia-header-nav__chevron";
  chevron.setAttribute("aria-hidden", "true");

  toggle.append(label, chevron);

  const panel = document.createElement("div");
  panel.className = "aivia-header-nav__menu";

  const sections = options.sections || menu.sections;

  sections.forEach((section) => {
    panel.append(buildSection(section.key, section.items, currentPath));
  });

  dropdown.append(toggle, panel);
  return dropdown;
}

function isMyAiviaPath(currentPath) {
  return (
    currentPath.startsWith("/my/aivia-dashboard") ||
    currentPath.startsWith("/my/resume") ||
    currentPath.startsWith("/my/aivia-talent")
  );
}

function getMyAiviaSections(currentUser) {
  const isAdmin = !!currentUser?.admin;
  const featureAccess = getMyAiviaFeatureAccess(currentUser);

  const candidateSection = {
    key: "my_aivia_candidates",
    items: ["my_aivia_evaluations", "my_aivia_mentorship", "my_aivia_resume"],
  };

  const hiringItems = [];

  if (isAdmin || featureAccess.search) {
    hiringItems.push("my_aivia_discover_talent");
  }

  if (isAdmin || featureAccess.prescreen) {
    hiringItems.push("my_aivia_customize_evaluation");
  }

  if (isAdmin || featureAccess.align) {
    hiringItems.push("my_aivia_generate_questions");
  }

  if (isAdmin || featureAccess.generate) {
    hiringItems.push("my_aivia_start_cohort");
  }

  const hiringSection = {
    key: "my_aivia_hiring",
    items: hiringItems,
  };

  if (isAdmin) {
    return [candidateSection, hiringSection];
  }

  if (hiringItems.length) {
    return [hiringSection];
  }

  return [candidateSection];
}

function buildMyAiviaDropdown(currentPath, currentUser) {
  const sections = getMyAiviaSections(currentUser);
  const dropdown = buildDropdown({ key: "my_aivia", sections }, currentPath, {
    sections,
    className: "aivia-header-nav__dropdown--my-aivia",
  });

  if (isMyAiviaPath(currentPath)) {
    dropdown.classList.add("has-active-item");
  }

  return dropdown;
}

function buildNav(currentPath, currentUser, includeMarketingMenus) {
  const nav = document.createElement("div");
  nav.className = "aivia-header-nav";

  if (includeMarketingMenus) {
    MENU_CONFIG.forEach((menu) => {
      nav.append(buildDropdown(menu, currentPath));
    });
  }

  if (currentUser) {
    nav.append(buildMyAiviaDropdown(currentPath, currentUser));
  }

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
  const currentPath = normalizeAiviaHeaderThemePath(
    router?.currentURL || window.location.pathname
  );
  const isAdminPage =
    currentPath === "/admin" || currentPath.startsWith("/admin/");
  const currentUser = api.getCurrentUser();
  const showMarketingMenus = shouldUseAiviaHeaderTheme(router);

  if (isAdminPage || (!showMarketingMenus && !currentUser)) {
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

  const nav = buildNav(currentPath, currentUser, showMarketingMenus);

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
  api.onAppEvent("current-user:refresh", sync);
  api.onAppEvent("logout", sync);
  sync();
});
