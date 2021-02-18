import { withPluginApi } from "discourse/lib/plugin-api";
export default {
  name: "messages-menu",
  initialize() {
    withPluginApi("0.10.0", (api) => {
      const user = Discourse.User.current();
      if (user !== null) {
        const { h } = require("virtual-dom");
        const QuickAccess = {
          MESSAGES: "messages",
        };

        api.createWidget("messages-menu", {
          tagName: "div.messages-menu",
          buildKey: () => "messages-menu",

          settings: {
            maxWidth: 320,
            showLogoutButton: true,
          },

          defaultState() {
            return {
              currentQuickAccess: QuickAccess.MESSAGES,
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
              this.sendWidgetAction("toggleMessagesMenu");
            } else {
              const $window = $(window);
              const windowWidth = $window.width();
              const $panel = $(".menu-panel");
              $panel.addClass("animate");
              $panel.css("right", -windowWidth);
              const $headerCloak = $(".header-cloak");
              $headerCloak.addClass("animate");
              $headerCloak.css("opacity", 0);
              later(() => this.sendWidgetAction("toggleMessagesMenu"), 200);
            }
          },

          clickOutside(e) {
            if (this.site.mobileView) {
              this.clickOutsideMobile(e);
            } else {
              this.sendWidgetAction("toggleMessagesMenu");
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
        });

        api.decorateWidget("header-icons:before", function (helper) {
          const headerState = helper.widget.parentWidget.state;

          return helper.attach("header-dropdown", {
            title: "messages-menu",
            icon: "envelope",
            iconId: "message-button",
            active: headerState.MessagesMenuVisible,
            action: "toggleMessagesMenu",
          });
        });

        api.attachWidgetAction("header", "toggleMessagesMenu", function () {
          this.state.MessagesMenuVisible = !this.state.MessagesMenuVisible;
        });

        api.addHeaderPanel(
          "messages-menu",
          "MessagesMenuVisible",
          function (attrs, state) {}
        );
      }
    });
  },
};
