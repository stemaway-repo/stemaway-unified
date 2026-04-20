/* global settings */

import { apiInitializer } from "discourse/lib/api";
import { defaultHomepage } from "discourse/lib/utilities";
import User from "discourse/models/user";

const STORAGE_KEY_COLLAPSED = "aivia-hero-collapsed";
const STORAGE_KEY_VISITS = "aivia-hero-visits";
const PRECOLLAPSED_CLASS = "aivia-hero-precollapsed";
const LOGIN_PATH = "/login";
const HERO_TAB_LINKS = {
  s: {
    primary: "/my/aivia-talent/search",
    secondary: "/aivia/inside-aivia",
    feature: "search",
  },
  p: {
    primary: "/my/aivia-talent/prescreen",
    secondary: "/aivia/context-pack",
    feature: "prescreen",
  },
  i: {
    primary: "/my/aivia-talent/generate",
    secondary: "/aivia/report-breakdown",
    feature: "generate",
  },
  g: {
    primary: null,
    secondary: "/aivia/internships",
    comingSoon: true,
  },
  c: {
    primary: "/my/aivia-dashboard",
    secondary: "/aivia/verified",
  },
};

let preparedHeroState = null;
let preparedHeroPath = null;
let preparedHeroIsLoggedIn = null;
let currentHeroIsLoggedIn = false;
let currentHeroUser = null;
let heroObserver = null;

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

function resolveCurrentUser(user = null) {
  return user || User.current() || null;
}

function getHeroFeatureAccess(user) {
  const serializedAccess = user?.aivia_analytics_feature_access;

  return {
    search: Boolean(
      user?.admin || serializedAccess?.search || serializedAccess?.performance
    ),
    prescreen: Boolean(user?.admin || serializedAccess?.prescreen),
    generate: Boolean(user?.admin || serializedAccess?.generate),
  };
}

function getPrimaryAction(dataP, defaultLabel, user) {
  const links = HERO_TAB_LINKS[dataP];

  if (!user) {
    return {
      label: defaultLabel,
      href: LOGIN_PATH,
      disabled: false,
    };
  }

  if (links?.comingSoon) {
    return {
      label: "Coming soon",
      href: null,
      disabled: true,
    };
  }

  if (!links?.feature) {
    return {
      label: defaultLabel,
      href: links?.primary || "#",
      disabled: false,
    };
  }

  const featureAccess = getHeroFeatureAccess(user);
  const hasAccess = Boolean(featureAccess[links.feature]);

  return {
    label: defaultLabel,
    href: hasAccess ? links.primary : null,
    disabled: !hasAccess,
  };
}

function setLinkState(link, { label, href, disabled }) {
  if (!link) {
    return;
  }

  if (label) {
    link.textContent = label;
  }

  link.classList.toggle("is-disabled", Boolean(disabled));

  if (disabled) {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("tabindex", "-1");
    return;
  }

  link.setAttribute("href", href || "#");
  link.removeAttribute("aria-disabled");
  link.removeAttribute("tabindex");
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

  if (!resolvedIsLoggedIn) {
    preparedHeroState = {
      consumed: false,
      isLoggedIn: false,
      shouldCollapse: false,
      visits: 0,
    };
    preparedHeroPath = currentPath;
    preparedHeroIsLoggedIn = false;
    syncPrecollapsedClass(false);

    return preparedHeroState;
  }

  const userCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED) === "true";
  const autoCollapseAfter = parseInt(
    settings.auto_collapse_after_visits || "3",
    10
  );
  const visits =
    parseInt(localStorage.getItem(STORAGE_KEY_VISITS) || "0", 10) + 1;
  const shouldCollapse =
    userCollapsed || (autoCollapseAfter > 0 && visits > autoCollapseAfter);

  localStorage.setItem(STORAGE_KEY_VISITS, visits.toString());
  syncPrecollapsedClass(shouldCollapse);

  preparedHeroState = {
    consumed: false,
    isLoggedIn: true,
    shouldCollapse,
    visits,
  };
  preparedHeroPath = currentPath;
  preparedHeroIsLoggedIn = true;

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

  const initialState = consumePreparedHeroState(
    window.location.pathname,
    resolveLoggedInState(currentHeroIsLoggedIn)
  );
  hero.dataset.initialized = "true";

  const headline = hero.querySelector("#aivia-headline");
  const demoWrap = hero.querySelector("#aivia-demo-wrap");
  const toggleBtn = hero.querySelector("#aivia-toggle-btn");
  const toggleText = hero.querySelector("#aivia-toggle-text");
  const toggleIcon = hero.querySelector("#aivia-toggle-icon");
  const persistCta = hero.querySelector("#aivia-persist-cta");
  const persistPrimary = hero.querySelector("#aivia-persist-primary");
  const persistSecondary = hero.querySelector("#aivia-persist-secondary");
  const mobileSel = hero.querySelector("#aivia-mobile-sel");
  const mobileDd = hero.querySelector("#aivia-mobile-dd");
  const mobileSelText = hero.querySelector("#aivia-mobile-sel-text");

  if (
    !headline ||
    !demoWrap ||
    !toggleBtn ||
    !toggleText ||
    !toggleIcon ||
    !persistCta
  ) {
    return;
  }

  const shouldCollapse = initialState?.shouldCollapse || false;

  function setCollapsed(collapsed) {
    if (collapsed) {
      demoWrap.classList.add("collapsed");
      toggleText.textContent = "Show demo";
      toggleIcon.classList.add("flipped");
      persistCta.style.display = "flex";
    } else {
      demoWrap.classList.remove("collapsed");
      toggleText.textContent = "Hide demo";
      toggleIcon.classList.remove("flipped");
      persistCta.style.display = "none";
    }
  }

  function setPanelCtas(dataP) {
    const links = HERO_TAB_LINKS[dataP];
    if (!links) {
      return;
    }

    const panel = hero.querySelector(`#aivia-${dataP}`);
    if (!panel) {
      return;
    }

    const primaryLink = panel.querySelector(".vw-cta .ct-p");
    const secondaryLink = panel.querySelector(".vw-cta .ct-s");

    setLinkState(
      primaryLink,
      getPrimaryAction(dataP, primaryLink?.textContent?.trim(), currentHeroUser)
    );
    setLinkState(secondaryLink, {
      label: secondaryLink?.textContent?.trim(),
      href: links.secondary,
      disabled: false,
    });
  }

  Object.keys(HERO_TAB_LINKS).forEach(setPanelCtas);

  setCollapsed(shouldCollapse);
  syncPrecollapsedClass(false);

  function switchTab(dataP, dataH, dataCta, dataCta2, label) {
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
    const links = HERO_TAB_LINKS[dataP];
    setLinkState(
      persistPrimary,
      getPrimaryAction(dataP, dataCta, currentHeroUser)
    );
    setLinkState(persistSecondary, {
      label: dataCta2,
      href: links?.secondary || "#",
      disabled: false,
    });

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
      switchTab(
        tab.dataset.p,
        tab.dataset.h,
        tab.dataset.cta,
        tab.dataset.cta2,
        tab.textContent
      );
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
      switchTab(
        option.dataset.p,
        option.dataset.h,
        option.dataset.cta,
        option.dataset.cta2,
        option.textContent
      );
      if (mobileSel && mobileDd) {
        mobileSel.classList.remove("open");
        mobileDd.classList.remove("open");
      }
    });
  });

  document.addEventListener("click", () => {
    if (mobileSel && mobileDd) {
      mobileSel.classList.remove("open");
      mobileDd.classList.remove("open");
    }
  });

  toggleBtn.addEventListener("click", () => {
    const isCollapsed = demoWrap.classList.contains("collapsed");
    const nextCollapsed = !isCollapsed;
    const shouldPersistCollapseState = resolveLoggedInState(
      currentHeroIsLoggedIn
    );

    setCollapsed(nextCollapsed);
    if (shouldPersistCollapseState) {
      localStorage.setItem(STORAGE_KEY_COLLAPSED, nextCollapsed.toString());
    }

    if (shouldPersistCollapseState && preparedHeroState && isHeroRoute()) {
      preparedHeroState.shouldCollapse = nextCollapsed;
      preparedHeroState.consumed = true;
    }
  });

  const activeTab = hero.querySelector("#aivia-tabs .dk-t.on");
  if (activeTab) {
    switchTab(
      activeTab.dataset.p,
      activeTab.dataset.h,
      activeTab.dataset.cta,
      activeTab.dataset.cta2,
      activeTab.textContent
    );
  }

  hero.syncHeroCtas = () => {
    Object.keys(HERO_TAB_LINKS).forEach(setPanelCtas);

    const currentTab =
      hero.querySelector("#aivia-tabs .dk-t.on") ||
      hero.querySelector("#aivia-tabs .dk-t");

    if (currentTab) {
      switchTab(
        currentTab.dataset.p,
        currentTab.dataset.h,
        currentTab.dataset.cta,
        currentTab.dataset.cta2,
        currentTab.textContent
      );
    }
  };
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
  const syncHero = () => {
    const hero = document.getElementById("aivia-hero");
    const user = resolveCurrentUser(api.getCurrentUser());
    const isLoggedIn = Boolean(user);

    currentHeroUser = user;
    currentHeroIsLoggedIn = isLoggedIn;

    if (hero?.dataset.initialized === "true") {
      hero.syncHeroCtas?.();
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
