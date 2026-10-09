import { action } from "@ember/object";
import { apiInitializer } from "discourse/lib/api";
import AiviaAccountAvatarBadge from "../components/aivia-account-avatar-badge";
import AiviaAccountMenuContent from "../components/aivia-account-menu-content";

export default apiInitializer((api) => {
  api.renderInOutlet(
    "user-dropdown-notifications__after",
    AiviaAccountAvatarBadge
  );

  api.modifyClass(
    "component:user-menu/menu",
    (Superclass) =>
      class extends Superclass {
        get classNames() {
          return `${super.classNames} aivia-account-menu`;
        }

        get topTabs() {
          return [];
        }

        get bottomTabs() {
          return [];
        }

        get currentPanelComponent() {
          return AiviaAccountMenuContent;
        }

        set currentPanelComponent(value) {
          super.currentPanelComponent = value;
        }

        @action
        focusFirstTab(element) {
          element
            .closest(".user-menu")
            ?.querySelector(".aivia-account-menu__link")
            ?.focus();
        }
      }
  );
});
