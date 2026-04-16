import { apiInitializer } from "discourse/lib/api";

const SVG_NS = "http://www.w3.org/2000/svg";

let observer;

function createSvg() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  return svg;
}

function appendShape(svg, tagName, attributes) {
  const node = document.createElementNS(SVG_NS, tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });

  svg.append(node);
}

function buildQuickStartsIcon() {
  const svg = createSvg();
  appendShape(svg, "circle", { cx: "12", cy: "12", r: "2.8" });
  appendShape(svg, "path", {
    d: "M12 3.5v2.4M12 18.1v2.4M3.5 12h2.4M18.1 12h2.4M6.2 6.2l1.7 1.7M16.1 16.1l1.7 1.7M17.8 6.2l-1.7 1.7M7.9 16.1l-1.7 1.7",
  });
  return svg;
}

function buildNavigationTitle() {
  const title = document.createElement("div");
  title.className = "aivia-menu-panel-title";

  const icon = document.createElement("span");
  icon.className =
    "aivia-menu-section-title__icon aivia-menu-section-title__icon--green";
  icon.append(buildQuickStartsIcon());

  const label = document.createElement("span");
  label.className = "aivia-menu-panel-title__text";
  label.textContent = "Navigation";

  title.append(icon, label);
  return title;
}

function decorateHamburgerPanelTitle() {
  document
    .querySelectorAll(".hamburger-panel .panel-body-contents")
    .forEach((panelBody) => {
      if (panelBody.querySelector(".aivia-menu-panel-title")) {
        return;
      }

      panelBody.prepend(buildNavigationTitle());
    });
}

function ensureObserver() {
  if (observer) {
    return;
  }

  observer = new MutationObserver(() => {
    decorateHamburgerPanelTitle();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export default apiInitializer((api) => {
  const initialize = () => {
    decorateHamburgerPanelTitle();
    ensureObserver();
  };

  api.onPageChange(initialize);
  initialize();
});
