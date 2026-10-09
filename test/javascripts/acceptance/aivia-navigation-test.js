import { click, currentURL, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { cloneJSON } from "discourse/lib/object";
import userFixtures from "discourse/tests/fixtures/user-fixtures";
import {
  acceptance,
  loggedInUser,
  publishToMessageBus,
} from "discourse/tests/helpers/qunit-helpers";

const MY_AIVIA = '[data-aivia-header-dropdown="my_aivia"]';
const ACCOUNT_LINK = '.aivia-account-menu__link[href$="/preferences/account"]';
const AVATAR_BADGE = "#toggle-current-user .aivia-account-menu__avatar-count";
const NOTIFICATION_BADGE =
  '.aivia-account-menu__link[href$="/notifications"] .aivia-account-menu__count';
const MESSAGE_BADGE =
  '.aivia-account-menu__link[href$="/messages"] .aivia-account-menu__count';

function notificationCounts(notifications, messages) {
  return {
    all_unread_notifications_count: notifications,
    new_personal_messages_notifications_count: messages,
    unread_notifications: notifications - messages,
    unread_high_priority_notifications: messages,
    grouped_unread_notifications: {},
    read_first_notification: true,
  };
}

function stubNavigationRequests(needs, userOverrides = {}) {
  needs.pretender((server, helper) => {
    server.get("/components.json", () =>
      helper.response({
        components: [],
        role_families: [],
        role_archetypes: [],
      })
    );
    server.get(
      "/stemaway-project-generation/fetch-topics-for-aivia-evaluator",
      () => helper.response({ topic_ids: [] })
    );
    server.get("/u/eviltrout.json", () => {
      const response = cloneJSON(userFixtures["/u/eviltrout.json"]);
      Object.assign(response.user, { can_edit: true }, userOverrides);
      return helper.response(response);
    });
  });
}

acceptance("AIVIA navigation | signed-in users", function (needs) {
  stubNavigationRequests(needs, { admin: false, moderator: true });
  needs.user({
    admin: false,
    moderator: true,
    all_unread_notifications_count: 3,
    new_personal_messages_notifications_count: 2,
    read_first_notification: true,
  });
  needs.settings({ navigation_menu: "hamburger" });

  test("account actions stay available across homepage, preferences, and forum", async function (assert) {
    await visit("/");

    assert.dom(MY_AIVIA).isVisible("My AIVIA is available on the homepage");
    assert
      .dom(AVATAR_BADGE)
      .hasText("3", "the avatar counts messages only once");
    assert
      .dom(document.body)
      .doesNotHaveClass(
        "aivia-admin-navigation",
        "moderators use member navigation"
      );

    await click("#toggle-current-user");

    const userPath = loggedInUser().path;
    assert
      .dom(".aivia-account-menu__link")
      .exists({ count: 4 }, "the popup has four actions without nested links");
    assert
      .dom('.aivia-account-menu__link[href$="/notifications"]')
      .hasAttribute("href", `${userPath}/notifications`, "opens notifications");
    assert.dom(NOTIFICATION_BADGE).hasText("3", "shows unread notifications");
    assert
      .dom('.aivia-account-menu__link[href$="/messages"]')
      .hasAttribute("href", `${userPath}/messages`, "opens messages");
    assert.dom(MESSAGE_BADGE).hasText("2", "shows unread messages");
    assert
      .dom(ACCOUNT_LINK)
      .hasText("My account", "shows a single account link");
    assert
      .dom("button.aivia-account-menu__link")
      .hasText("Log out", "keeps the logout action");

    await click(ACCOUNT_LINK);

    assert.strictEqual(
      currentURL(),
      `${userPath}/preferences/account`,
      "opens account preferences directly"
    );
    assert.dom(MY_AIVIA).isVisible("My AIVIA remains available on user pages");
    await click("#toggle-current-user");
    assert
      .dom(ACCOUNT_LINK)
      .hasText("My account", "preferences use the same menu");

    await visit("/latest");

    assert.dom(MY_AIVIA).isVisible("My AIVIA remains available in the forum");
    assert
      .dom(document.body)
      .doesNotHaveClass(
        "aivia-admin-navigation",
        "the forum retains member navigation"
      );
    await click("#toggle-current-user");
    assert
      .dom(".aivia-account-menu__link")
      .exists({ count: 4 }, "the forum uses the same account menu");

    await visit("/t/internationalization-localization/280");
    await click("#toggle-current-user");
    assert
      .dom(ACCOUNT_LINK)
      .hasText("My account", "topics use the same account menu");
  });

  test("avatar and item badges update when notifications arrive and clear", async function (assert) {
    await visit("/latest");
    await click("#toggle-current-user");

    await publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(4, 2)
    );
    assert
      .dom(AVATAR_BADGE)
      .hasText("4", "a new notification updates the avatar");
    assert
      .dom(NOTIFICATION_BADGE)
      .hasText("4", "the notification item updates without reloading");
    assert.dom(MESSAGE_BADGE).hasText("2", "the message count stays separate");

    await publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(5, 3)
    );
    assert
      .dom(AVATAR_BADGE)
      .hasText("5", "a new message updates the combined avatar count");
    assert
      .dom(MESSAGE_BADGE)
      .hasText("3", "the message item updates without reloading");
    assert
      .dom("#toggle-current-user")
      .hasAttribute(
        "aria-label",
        "Account menu (5 unread items)",
        "the avatar announces its unread count"
      );

    await publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(0, 0)
    );
    assert.dom(AVATAR_BADGE).doesNotExist("the avatar badge clears");
    assert
      .dom(NOTIFICATION_BADGE)
      .doesNotExist("the notification badge clears");
    assert.dom(MESSAGE_BADGE).doesNotExist("the message badge clears");
    assert
      .dom("#toggle-current-user")
      .hasAttribute(
        "aria-label",
        "Account menu",
        "the cleared avatar has its normal label"
      );
  });
});

acceptance("AIVIA navigation | administrators", function (needs) {
  stubNavigationRequests(needs);
  needs.user({ admin: true });
  needs.settings({ navigation_menu: "hamburger" });

  test("admins keep navigation and My AIVIA on homepage and admin pages", async function (assert) {
    await visit("/");

    assert.dom(MY_AIVIA).isVisible("My AIVIA appears on the homepage");
    assert
      .dom(document.body)
      .hasClass("aivia-admin-navigation", "admins retain navigation");
    assert
      .dom(".d-header .hamburger-dropdown")
      .isVisible("admins keep the homepage hamburger");

    await visit("/admin");

    assert.dom(MY_AIVIA).isVisible("My AIVIA appears in the admin header");
    assert
      .dom(".d-header .header-sidebar-toggle")
      .isVisible("admins retain their sidebar toggle");
    await click("#toggle-current-user");
    assert
      .dom(ACCOUNT_LINK)
      .hasText("My account", "admin pages use the same account menu");
  });
});

acceptance("AIVIA navigation | mobile account menu", function (needs) {
  stubNavigationRequests(needs, { admin: false, moderator: false });
  needs.user({
    admin: false,
    moderator: false,
    ...notificationCounts(120, 101),
  });
  needs.mobileView();
  needs.settings({ navigation_menu: "hamburger" });

  test("mobile keeps badges, direct account navigation, and dismissible menu", async function (assert) {
    await visit("/t/internationalization-localization/280");
    assert
      .dom(AVATAR_BADGE)
      .hasText("99+", "large avatar counts fit on mobile");

    await click("#toggle-current-user");
    assert
      .dom(".aivia-account-menu__link")
      .exists({ count: 4 }, "all four actions are available on mobile");
    assert
      .dom(NOTIFICATION_BADGE)
      .hasText("99+", "large notification counts stay compact");
    assert
      .dom(MESSAGE_BADGE)
      .hasText("99+", "large message counts stay compact");
    await click("#toggle-current-user");
    assert
      .dom(".aivia-account-menu")
      .doesNotExist("the avatar closes the mobile menu");
    assert
      .dom(AVATAR_BADGE)
      .hasText("99+", "closing the menu preserves unread counts");

    await click("#toggle-current-user");
    await click(ACCOUNT_LINK);
    assert.strictEqual(
      currentURL(),
      `${loggedInUser().path}/preferences/account`,
      "My account opens account preferences on mobile"
    );
  });
});

acceptance("AIVIA navigation | guests", function (needs) {
  stubNavigationRequests(needs);
  needs.mobileView();
  needs.settings({ navigation_menu: "hamburger" });

  test("guests can find My AIVIA on homepage and topic pages", async function (assert) {
    await visit("/");

    assert.dom(MY_AIVIA).isVisible("My AIVIA appears for guests");
    assert
      .dom(document.body)
      .doesNotHaveClass(
        "aivia-admin-navigation",
        "guests use public navigation"
      );

    await click(MY_AIVIA);

    assert
      .dom(MY_AIVIA)
      .hasAttribute("aria-expanded", "true", "opens My AIVIA on mobile");
    assert
      .dom('.aivia-header-nav__item[href="/aivia/faculty-workspace"]')
      .isVisible("lab tools are accessible in the mobile menu");

    await visit("/t/internationalization-localization/280");

    assert.dom(MY_AIVIA).isVisible("My AIVIA is available on topic pages");
  });
});
