import { defaultHomepage } from "discourse/lib/utilities";

const AIVIA_MARKETING_PATHS = new Set([
  "/aivia",
  "/aivia/inside-aivia",
  "/aivia/context-pack",
  "/aivia/projects",
  "/aivia/scenarios",
  "/aivia/report-breakdown",
  "/full-time",
  "/hiring",
  "/aivia/full-time",
  "/aivia/hiring",
  "/aivia/freelance",
  "/aivia/internships",
  "/aivia/talent-pipeline",
  "/aivia/project-mentorship",
  "/aivia/mentorship",
  "/aivia/verified",
]);

export function normalizeAiviaHeaderThemePath(path) {
  const cleanPath = (path || "/").split("?")[0].split("#")[0];

  if (cleanPath.length > 1 && cleanPath.endsWith("/")) {
    return cleanPath.slice(0, -1);
  }

  return cleanPath || "/";
}

export function shouldUseAiviaHeaderTheme(router) {
  const currentPath = normalizeAiviaHeaderThemePath(
    router?.currentURL || window.location.pathname
  );
  const isAdminPage =
    currentPath === "/admin" || currentPath.startsWith("/admin/");
  const homepagePath = `/${defaultHomepage()}`;
  const isHomepageRoute =
    router?.currentRouteName === `discovery.${defaultHomepage()}`;
  const isHomepagePath = currentPath === "/" || currentPath === homepagePath;

  if (isAdminPage) {
    return false;
  }

  return Boolean(
    isHomepageRoute || isHomepagePath || AIVIA_MARKETING_PATHS.has(currentPath)
  );
}

export function shouldUseAiviaHomepageTheme(router) {
  const currentPath = normalizeAiviaHeaderThemePath(
    router?.currentURL || window.location.pathname
  );
  const homepagePath = `/${defaultHomepage()}`;
  const isHomepageRoute =
    router?.currentRouteName === `discovery.${defaultHomepage()}`;
  const isHomepagePath = currentPath === "/" || currentPath === homepagePath;

  return Boolean(isHomepageRoute || isHomepagePath);
}
