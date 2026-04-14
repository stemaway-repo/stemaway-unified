/* global settings */

import { apiInitializer } from "discourse/lib/api";

const STORAGE_KEY_COLLAPSED = "aivia-hero-collapsed";
const STORAGE_KEY_VISITS = "aivia-hero-visits";
const HERO_LINKS = {
  s: {
    primary: "/aivia/full-time",
    secondary: "/aivia/inside-aivia",
  },
  p: {
    primary: "/aivia/context-pack",
    secondary: "/aivia/report-breakdown",
  },
  i: {
    primary: "/aivia/report-breakdown",
    secondary: "/aivia/projects",
  },
  g: {
    primary: "/aivia/talent-pipeline",
    secondary: "/aivia/project-mentorship",
  },
  c: {
    primary: "/aivia/verified",
    secondary: "/aivia/inside-aivia",
  },
};

function initHero() {
  const hero = document.getElementById("aivia-hero");

  if (!hero || hero.dataset.initialized === "true") {
    return;
  }

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

  const autoCollapseAfter = parseInt(
    settings.auto_collapse_after_visits || "3",
    10
  );
  let visits =
    parseInt(localStorage.getItem(STORAGE_KEY_VISITS) || "0", 10) + 1;
  localStorage.setItem(STORAGE_KEY_VISITS, visits.toString());

  const userCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED) === "true";
  const shouldCollapse =
    userCollapsed || (autoCollapseAfter > 0 && visits > autoCollapseAfter);

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
    const links = HERO_LINKS[dataP];
    if (!links) {
      return;
    }

    const panel = hero.querySelector(`#aivia-${dataP}`);
    if (!panel) {
      return;
    }

    const primaryLink = panel.querySelector(".vw-cta .ct-p");
    const secondaryLink = panel.querySelector(".vw-cta .ct-s");

    if (primaryLink) {
      primaryLink.href = links.primary;
    }

    if (secondaryLink) {
      secondaryLink.href = links.secondary;
    }
  }

  Object.keys(HERO_LINKS).forEach(setPanelCtas);

  if (shouldCollapse) {
    setCollapsed(true);
  }

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
    const links = HERO_LINKS[dataP];
    if (persistPrimary) {
      persistPrimary.textContent = dataCta;
      persistPrimary.href = links?.primary || "#";
    }
    if (persistSecondary) {
      persistSecondary.textContent = dataCta2;
      persistSecondary.href = links?.secondary || "#";
    }

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
    setCollapsed(!isCollapsed);
    localStorage.setItem(STORAGE_KEY_COLLAPSED, (!isCollapsed).toString());
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
}

export default apiInitializer((api) => {
  api.onPageChange(() => {
    initHero();
  });

  if (document.getElementById("aivia-hero")) {
    initHero();
  }
});
