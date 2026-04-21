import { apiInitializer } from "discourse/lib/api";

let observer;

function removeEasyFooterPoweredByDiscourseLink() {
  document
    .querySelectorAll(
      '.custom-footer a[data-easyfooter-small-link="powered-by:-discourse"]'
    )
    .forEach((link) => link.remove());
}

function movePoweredByDiscourseIntoFooter() {
  const poweredBy = document.querySelector(".powered-by-discourse");
  const customFooter = document.querySelector(".custom-footer");

  if (!poweredBy || !customFooter || customFooter.contains(poweredBy)) {
    return;
  }

  customFooter.append(poweredBy);
}

function ensureObserver() {
  if (observer) {
    return;
  }

  observer = new MutationObserver(() => {
    removeEasyFooterPoweredByDiscourseLink();
    movePoweredByDiscourseIntoFooter();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export default apiInitializer((api) => {
  const syncPoweredByDiscourse = () => {
    removeEasyFooterPoweredByDiscourseLink();
    movePoweredByDiscourseIntoFooter();
    ensureObserver();
  };

  api.onPageChange(syncPoweredByDiscourse);
  syncPoweredByDiscourse();
});
