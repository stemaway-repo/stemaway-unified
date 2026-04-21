import { apiInitializer } from "discourse/lib/api";

function syncLoginPreferencesBodyClass(api) {
  const router = api.container.lookup("service:router");

  document.body.classList.toggle(
    "login-preferences-page",
    router?.currentRouteName === "login-preferences"
  );
}

export default apiInitializer((api) => {
  const updateBodyClass = () => syncLoginPreferencesBodyClass(api);

  api.onPageChange(updateBodyClass);
  updateBodyClass();
});
