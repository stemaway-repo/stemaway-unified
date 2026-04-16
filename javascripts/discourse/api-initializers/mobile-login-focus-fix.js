import { apiInitializer } from "discourse/lib/api";

function resetMobileLoginAutofocus() {
  if (window.innerWidth > 767 || window.location.pathname !== "/login") {
    return;
  }

  const blurAndResetScroll = () => {
    const activeElement = document.activeElement;

    if (activeElement?.id === "login-account-name") {
      activeElement.blur();
    }

    window.scrollTo(0, 0);
  };

  requestAnimationFrame(blurAndResetScroll);
  setTimeout(blurAndResetScroll, 250);
}

export default apiInitializer((api) => {
  api.onPageChange(resetMobileLoginAutofocus);
  resetMobileLoginAutofocus();
});
