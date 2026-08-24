import { apiInitializer } from "discourse/lib/api";
import { defaultHomepage } from "discourse/lib/utilities";
import User from "discourse/models/user";
import { getAiviaFeatureAccess } from "discourse/plugins/stemaway-ui-addons/discourse/utils/aivia-analytics-access";

const PRECOLLAPSED_CLASS = "aivia-hero-precollapsed";
const AIVIA_PLANS_URL = "/aivia/plans";
const HERO_LINKS = {
  s: {
    primary: "/aivia/scenarios",
    secondary: "/aivia/inside-aivia",
  },
  p: {
    primary: "/my/aivia-talent/prescreen",
    secondary: "/aivia/context-pack",
  },
  i: {
    primary: "/my/aivia-talent/align",
    secondary: "/aivia/report-breakdown",
  },
  c: {
    primary: "/my/aivia-dashboard",
    secondary: "/aivia/verified",
  },
};
const HERO_CTA_LABELS = {
  s: "Explore mapping",
  p: "Customize evaluation",
  i: "Generate questions",
  c: "My dashboard",
};
const HERO_FEATURES = {
  s: "search",
  p: "prescreen",
  i: "align",
};

let preparedHeroState = null;
let preparedHeroPath = null;
let preparedHeroIsLoggedIn = null;
let currentHeroIsLoggedIn = false;
let heroObserver = null;
let currentSiteSettings = null;

function normalizePath(path) {
  const cleanPath = (path || "/").split("?")[0].split("#")[0];

  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    return cleanPath.slice(0, -1);
  }

  return cleanPath || "/";
}

function isHeroRoute(path) {
  const currentPath = normalizePath(path);
  const homepagePath = `/${defaultHomepage()}`;

  return currentPath === "/" || currentPath === homepagePath;
}

function syncPrecollapsedClass(shouldCollapse) {
  document.documentElement.classList.toggle(
    PRECOLLAPSED_CLASS,
    Boolean(shouldCollapse)
  );
}

function resolveLoggedInState(isLoggedIn = false) {
  return Boolean(isLoggedIn || User.current());
}

function prepareHeroState(path = window.location.pathname, isLoggedIn = false) {
  const resolvedIsLoggedIn = resolveLoggedInState(isLoggedIn);
  const currentPath = normalizePath(path);

  if (
    preparedHeroState &&
    preparedHeroPath === currentPath &&
    preparedHeroIsLoggedIn === resolvedIsLoggedIn
  ) {
    return preparedHeroState;
  }

  if (!isHeroRoute(currentPath)) {
    preparedHeroState = null;
    preparedHeroPath = currentPath;
    preparedHeroIsLoggedIn = resolvedIsLoggedIn;
    syncPrecollapsedClass(false);
    return null;
  }

  preparedHeroState = {
    consumed: false,
    isLoggedIn: resolvedIsLoggedIn,
    shouldCollapse: false,
    visits: 0,
  };
  preparedHeroPath = currentPath;
  preparedHeroIsLoggedIn = resolvedIsLoggedIn;
  syncPrecollapsedClass(false);

  return preparedHeroState;
}

function consumePreparedHeroState(
  path = window.location.pathname,
  isLoggedIn = false
) {
  const state = prepareHeroState(path, resolveLoggedInState(isLoggedIn));

  if (state) {
    state.consumed = true;
  }

  return state;
}

function initHero() {
  const hero = document.getElementById("aivia-hero");

  if (!hero || hero.dataset.initialized === "true") {
    return;
  }

  consumePreparedHeroState(
    window.location.pathname,
    resolveLoggedInState(currentHeroIsLoggedIn)
  );
  hero.dataset.initialized = "true";

  const headline = hero.querySelector("#aivia-headline");
  const demoWrap = hero.querySelector("#aivia-demo-wrap");
  const mobileSel = hero.querySelector("#aivia-mobile-sel");
  const mobileDd = hero.querySelector("#aivia-mobile-dd");
  const mobileSelText = hero.querySelector("#aivia-mobile-sel-text");
  const currentUser = User.current();
  const featureAccess = getAiviaFeatureAccess(currentUser, currentSiteSettings);

  if (!headline || !demoWrap) {
    return;
  }

  function buildLockIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "ct-lock");
    svg.setAttribute("width", "14");
    svg.setAttribute("height", "14");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("aria-hidden", "true");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "5");
    rect.setAttribute("y", "11");
    rect.setAttribute("width", "14");
    rect.setAttribute("height", "10");
    rect.setAttribute("rx", "2");
    rect.setAttribute("ry", "2");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M8 11V7a4 4 0 0 1 8 0v4");

    svg.append(rect, path);

    return svg;
  }

  function getDisplayLabel(element) {
    if (!element) {
      return "";
    }

    if (!element.dataset.label) {
      element.dataset.label = element.textContent.trim();
    }

    return element.dataset.label;
  }

  function isLockedFeature(dataP) {
    const feature = HERO_FEATURES[dataP];
    if (!feature) {
      return false;
    }

    return !featureAccess?.[feature];
  }

  function setPrimaryCtaContent(link, label, locked = false) {
    if (!link) {
      return;
    }

    link.replaceChildren();

    if (locked) {
      link.append(buildLockIcon());
    }

    link.append(document.createTextNode(label));
  }

  function setPanelCtas(dataP) {
    const links = HERO_LINKS[dataP];
    const label = HERO_CTA_LABELS[dataP];
    if (!links) {
      return;
    }

    const panel = hero.querySelector(`#aivia-${dataP}`);
    if (!panel) {
      return;
    }

    const primaryLink = panel.querySelector(".vw-cta .ct-p");
    const secondaryLink = panel.querySelector(".vw-cta .ct-s");
    const locked = isLockedFeature(dataP);

    if (primaryLink) {
      primaryLink.href = locked ? AIVIA_PLANS_URL : links.primary;
      primaryLink.target = "";
      primaryLink.rel = "";
      primaryLink.classList.toggle("ct--locked", locked);
      primaryLink.dataset.locked = locked ? "true" : "false";
      setPrimaryCtaContent(primaryLink, label, locked);
    }

    if (secondaryLink) {
      secondaryLink.href = links.secondary;
    }
  }

  Object.keys(HERO_LINKS).forEach(setPanelCtas);

  demoWrap.classList.remove("collapsed", "is-transitioning");
  demoWrap.style.height = "";
  syncPrecollapsedClass(false);

  function switchTab(dataP, dataH, label) {
    hero
      .querySelectorAll("#aivia-tabs .dk-t")
      .forEach((button) => button.classList.remove("on"));
    hero
      .querySelectorAll(".vw")
      .forEach((panel) => panel.classList.remove("on"));

    const matchingTab = hero.querySelector(
      `#aivia-tabs .dk-t[data-p="${dataP}"]`
    );
    if (matchingTab) {
      matchingTab.classList.add("on");
    }

    const panel = hero.querySelector(`#aivia-${dataP}`);
    if (panel) {
      panel.classList.add("on");
    }

    headline.innerHTML = dataH;

    if (mobileSelText) {
      mobileSelText.textContent = label;
    }

    hero
      .querySelectorAll(".dk-mobile-opt")
      .forEach((option) => option.classList.remove("active"));
    const matchingOpt = hero.querySelector(`.dk-mobile-opt[data-p="${dataP}"]`);
    if (matchingOpt) {
      matchingOpt.classList.add("active");
    }
  }

  hero.querySelectorAll("#aivia-tabs .dk-t").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab.dataset.p, tab.dataset.h, getDisplayLabel(tab));
    });
  });

  if (mobileSel && mobileDd) {
    mobileSel.addEventListener("click", (event) => {
      event.stopPropagation();
      mobileSel.classList.toggle("open");
      mobileDd.classList.toggle("open");
    });
  }

  hero.querySelectorAll(".dk-mobile-opt").forEach((option) => {
    option.addEventListener("click", () => {
      switchTab(option.dataset.p, option.dataset.h, getDisplayLabel(option));
      if (mobileSel && mobileDd) {
        mobileSel.classList.remove("open");
        mobileDd.classList.remove("open");
      }
    });
  });

  hero.querySelectorAll(".dk-component-tile").forEach((card) => {
    const component = card.dataset.component || "component";

    const updateCardState = (isFlipped) => {
      card.classList.toggle("is-flipped", isFlipped);
      card.setAttribute("aria-expanded", isFlipped ? "true" : "false");
      card.setAttribute(
        "aria-label",
        isFlipped
          ? `Show ${component} summary`
          : `Show failure modes for ${component}`
      );
    };

    updateCardState(false);
    card.addEventListener("click", () => {
      updateCardState(!card.classList.contains("is-flipped"));
    });
  });

  document.addEventListener("click", () => {
    if (mobileSel && mobileDd) {
      mobileSel.classList.remove("open");
      mobileDd.classList.remove("open");
    }
  });

  const activeTab = hero.querySelector("#aivia-tabs .dk-t.on");
  if (activeTab) {
    switchTab(activeTab.dataset.p, activeTab.dataset.h, getDisplayLabel(activeTab));
  }
}

function watchForHero() {
  if (heroObserver || !document.body) {
    return;
  }

  heroObserver = new MutationObserver(() => {
    if (!document.getElementById("aivia-hero")) {
      return;
    }

    heroObserver.disconnect();
    heroObserver = null;
    initHero();
  });

  heroObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export default apiInitializer((api) => {
  currentSiteSettings =
    api.container.lookup("service:site-settings") || currentSiteSettings;

  const syncHero = () => {
    const hero = document.getElementById("aivia-hero");
    const isLoggedIn = resolveLoggedInState(api.getCurrentUser());

    currentHeroIsLoggedIn = isLoggedIn;

    if (hero?.dataset.initialized === "true") {
      syncPrecollapsedClass(false);
      return;
    }

    prepareHeroState(window.location.pathname, isLoggedIn);

    if (hero) {
      if (heroObserver) {
        heroObserver.disconnect();
        heroObserver = null;
      }

      initHero();
      return;
    }

    watchForHero();
  };

  api.onPageChange(syncHero);
  syncHero();
});
