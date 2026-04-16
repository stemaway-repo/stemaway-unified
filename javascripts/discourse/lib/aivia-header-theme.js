import { defaultHomepage } from "discourse/lib/utilities";

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
  const homepagePath = `/${defaultHomepage()}`;
  const isHomepageRoute =
    router?.currentRouteName === `discovery.${defaultHomepage()}`;
  const isHomepagePath = currentPath === "/" || currentPath === homepagePath;
  const isAiviaPage =
    currentPath === "/aivia" || currentPath.startsWith("/aivia/");

  return Boolean(isHomepageRoute || isHomepagePath || isAiviaPage);
}
