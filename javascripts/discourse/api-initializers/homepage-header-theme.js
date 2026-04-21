import { apiInitializer } from "discourse/lib/api";
import {
  shouldUseAiviaHeaderTheme,
  shouldUseAiviaHomepageTheme,
} from "../lib/aivia-header-theme";

function syncHomepageHeaderClass(api) {
  const router = api.container.lookup("service:router");

  document.body.classList.toggle(
    "aivia-homepage-nav",
    shouldUseAiviaHeaderTheme(router)
  );
  document.body.classList.toggle(
    "aivia-homepage-route",
    shouldUseAiviaHomepageTheme(router)
  );
}

export default apiInitializer((api) => {
  const updateHeaderTheme = () => syncHomepageHeaderClass(api);

  api.onPageChange(updateHeaderTheme);
  updateHeaderTheme();
});
