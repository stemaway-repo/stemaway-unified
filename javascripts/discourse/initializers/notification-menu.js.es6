import { later } from "@ember/runloop";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "notification-menu",
  initialize() {
    withPluginApi("0.10.1", (api) => {
      const user = Discourse.User.current();
      if (user !== null) {
        const { h } = require("virtual-dom");
        const QuickAccess = {
          NOTIFICATIONS: "notifications",
        };

        api.createWidget("notifications-menu", {
          tagName: "div.notifications-menu",
          buildKey: () => "notifications-menu",

          settings: {
            maxWidth: 320,
            showLogoutButton: true,
          },

          defaultState() {
            return {
              currentQuickAccess: QuickAccess.NOTIFICATIONS,
              hasUnread: false,
              markUnread: null,
            };
          },

          panelContents() {
            const path = this.currentUser.get("path");

            const result = [this.quickAccessPanel(path)];

            if (this.state.hasUnread) {
              result.push(h("hr.bottom-area"));
            }

            return result;
          },

          dismissNotifications() {
            return this.state.markRead();
          },

          itemsLoaded({ hasUnread, markRead }) {
            this.state.hasUnread = hasUnread;
            this.state.markRead = markRead;
          },

          html() {
            return this.attach("menu-panel", {
              maxWidth: this.settings.maxWidth,
              contents: () => this.panelContents(),
            });
          },

          clickOutsideMobile(e) {
            const $centeredElement = $(
              document.elementFromPoint(e.clientX, e.clientY)
            );
            if (
              $centeredElement.parents(".panel").length &&
              !$centeredElement.hasClass("header-cloak")
            ) {
              this.sendWidgetAction("toggleNotificationsMenu");
            } else {
              const $window = $(window);
              const windowWidth = $window.width();
              const $panel = $(".menu-panel");
              $panel.addClass("animate");
              $panel.css("right", -windowWidth);
              const $headerCloak = $(".header-cloak");
              $headerCloak.addClass("animate");
              $headerCloak.css("opacity", 0);
              later(
                () => this.sendWidgetAction("toggleNotificationsMenu"),
                200
              );
            }
          },

          clickOutside(e) {
            if (this.site.mobileView) {
              this.clickOutsideMobile(e);
            } else {
              this.sendWidgetAction("toggleNotificationsMenu");
            }
          },

          quickAccess(type) {
            if (this.state.currentQuickAccess !== type) {
              this.state.currentQuickAccess = type;
            }
          },

          quickAccessPanel(path) {
            const { showLogoutButton } = this.settings;
            // This deliberately does NOT fallback to a default quick access panel.
            return this.attach(
              `quick-access-${this.state.currentQuickAccess}`,
              {
                path,
                showLogoutButton,
              }
            );
          },

          hideBottomMethods() {
            return false;
          },
        });

        api.decorateWidget("header-icons:before", function (helper) {
          const headerState = helper.widget.parentWidget.state;

          return helper.attach("header-dropdown", {
            title: "notifications-menu",
            icon: "bell",
            iconId: "bell-button",
            active: headerState.NotificationsMenuVisible,
            action: "toggleNotificationsMenu",
          });
        });

        api.attachWidgetAction(
          "header",
          "toggleNotificationsMenu",
          function () {
            this.state.NotificationsMenuVisible = !this.state
              .NotificationsMenuVisible;
          }
        );

        api.addHeaderPanel(
          "notifications-menu",
          "NotificationsMenuVisible",
          function (attrs, state) {}
        );
      }
    });
  },
};
