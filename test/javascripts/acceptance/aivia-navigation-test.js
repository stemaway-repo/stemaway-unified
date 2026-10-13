import {
  click,
  currentURL,
  find,
  triggerKeyEvent,
  visit,
  waitFor,
  waitUntil,
} from "@ember/test-helpers";
import { test } from "qunit";
import { cloneJSON } from "discourse/lib/object";
import { NOTIFICATION_TYPES } from "discourse/tests/fixtures/concerns/notification-types";
import userFixtures from "discourse/tests/fixtures/user-fixtures";
import pretender, { response } from "discourse/tests/helpers/create-pretender";
import {
  acceptance,
  loggedInUser,
  publishToMessageBus,
} from "discourse/tests/helpers/qunit-helpers";
import { i18n } from "discourse-i18n";

const MY_AIVIA = '[data-aivia-header-dropdown="my_aivia"]';
const ACCOUNT_LINK = '.aivia-account-menu__link[href$="/preferences/account"]';
const AVATAR_BADGE = "#toggle-current-user .aivia-account-menu__avatar-count";
const NOTIFICATION_BADGE =
  '.aivia-account-menu__link[href$="/notifications"] .aivia-account-menu__count';
const MESSAGE_BADGE =
  '.aivia-account-menu__link[href$="/messages"] .aivia-account-menu__count';
const DISMISS_NOTIFICATIONS = ".aivia-account-menu__dismiss-button";
const CONFIRM_DISMISS = ".dismiss-notification-confirmation .btn-primary";
const CANCEL_DISMISS = ".dismiss-notification-confirmation .btn-default";

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

function stubNavigationRequests(needs, userOverrides = {}, extraRequests) {
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
      const userResponse = cloneJSON(userFixtures["/u/eviltrout.json"]);
      Object.assign(userResponse.user, { can_edit: true }, userOverrides);
      return helper.response(userResponse);
    });
    server.put("/notifications/mark-read", () => helper.response({}));
    extraRequests?.(server, helper);
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
      .dom(".aivia-account-menu__items > li")
      .exists({ count: 5 }, "the popup includes navigation and dismissal");
    assert
      .dom('.aivia-account-menu__link[href$="/notifications"]')
      .hasAttribute("href", `${userPath}/notifications`, "opens notifications");
    assert.dom(NOTIFICATION_BADGE).hasText("3", "shows unread notifications");
    assert
      .dom('.aivia-account-menu__link[href$="/messages"]')
      .hasAttribute("href", `${userPath}/messages`, "opens messages");
    assert.dom(MESSAGE_BADGE).hasText("2", "shows unread messages");
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .hasText("Dismiss all", "offers unread dismissal beside the alerts");
    assert
      .dom(ACCOUNT_LINK)
      .hasText("My account", "shows a single account link");
    assert
      .dom(".aivia-account-menu__logout button")
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
      .dom(".aivia-account-menu__items > li")
      .exists({ count: 5 }, "the forum uses the same account menu");

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

acceptance("AIVIA navigation | notification dismissal", function (needs) {
  let requests;

  stubNavigationRequests(needs, {}, (server, helper) => {
    requests = [];
    server.put("/notifications/mark-read", (request) => {
      requests.push(request);
      return helper.response({ success: true });
    });
  });
  needs.user({ ...notificationCounts(3, 2) });
  needs.settings({ navigation_menu: "hamburger" });

  test("seen but unread notifications retain dismissal even without summary badges", async function (assert) {
    await visit("/latest");
    await publishToMessageBus(`/notification/${loggedInUser().id}`, {
      ...notificationCounts(0, 0),
      unread_high_priority_notifications: 1,
      grouped_unread_notifications: { [NOTIFICATION_TYPES.private_message]: 1 },
    });
    await click("#toggle-current-user");

    assert.dom(AVATAR_BADGE).doesNotExist("the summary has no new alerts");
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .isVisible("unread alerts can still be dismissed");
    await click(DISMISS_NOTIFICATIONS);
    assert
      .dom(".dismiss-notification-confirmation .d-modal__body")
      .hasText(
        i18n("notifications.dismiss_confirmation.body.default", { count: 1 }),
        "seen important alerts still require confirmation"
      );
    await click(CANCEL_DISMISS);
  });

  test("seen low priority notifications remain dismissible without confirmation", async function (assert) {
    await visit("/latest");
    await publishToMessageBus(`/notification/${loggedInUser().id}`, {
      ...notificationCounts(0, 0),
      grouped_unread_notifications: { [NOTIFICATION_TYPES.liked]: 1 },
    });
    await click("#toggle-current-user");

    assert
      .dom(DISMISS_NOTIFICATIONS)
      .isVisible("grouped unread alerts retain dismissal");
    await click(DISMISS_NOTIFICATIONS);
    assert.strictEqual(
      requests.length,
      1,
      "dismisses seen low priority alerts directly"
    );
    assert
      .dom(".dismiss-notification-confirmation")
      .doesNotExist("does not confirm low priority alerts");
  });

  test("confirms important notifications and cancellation preserves unread alerts", async function (assert) {
    await visit("/latest");
    await click("#toggle-current-user");
    await click(DISMISS_NOTIFICATIONS);

    assert
      .dom(".dismiss-notification-confirmation .d-modal__body")
      .hasText(
        i18n("notifications.dismiss_confirmation.body.default", { count: 2 }),
        "uses the core warning for important notifications, including messages"
      );
    assert.strictEqual(requests.length, 0, "waits for explicit confirmation");

    await click(CANCEL_DISMISS);

    assert.strictEqual(requests.length, 0, "cancelling sends no request");
    assert.dom(AVATAR_BADGE).hasText("3", "cancelling preserves the total");
    assert.dom(MESSAGE_BADGE).hasText("2", "cancelling preserves messages");
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .isFocused("focus returns to dismissal after cancelling");
    assert.dom(DISMISS_NOTIFICATIONS).isEnabled("dismissal remains available");
  });

  test("confirmed dismissal uses server updates to clear both counters", async function (assert) {
    await visit("/latest");
    await click("#toggle-current-user");
    await click(DISMISS_NOTIFICATIONS);
    await click(CONFIRM_DISMISS);

    assert.strictEqual(requests.length, 1, "sends a single dismissal request");
    assert.strictEqual(
      new URLSearchParams(requests[0].requestBody).get("dismiss_types"),
      null,
      "dismisses all notification types"
    );
    assert.dom(AVATAR_BADGE).hasText("3", "waits for authoritative counts");

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
      .dom(DISMISS_NOTIFICATIONS)
      .doesNotExist("the action hides when read");
    assert
      .dom('.aivia-account-menu__link[href$="/notifications"]')
      .isFocused("focus remains on Notifications after dismissal");
  });

  test("low priority notifications dismiss without confirmation", async function (assert) {
    await visit("/latest");
    await publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(1, 0)
    );
    await click("#toggle-current-user");
    await click(DISMISS_NOTIFICATIONS);

    assert.strictEqual(
      requests.length,
      1,
      "dismisses low priority alerts directly"
    );
    assert
      .dom(".dismiss-notification-confirmation")
      .doesNotExist("does not show an unnecessary confirmation");
  });

  test("failed dismissal reports the error and preserves all badges for retry", async function (assert) {
    pretender.put("/notifications/mark-read", () =>
      response(500, { errors: ["Unable to dismiss notifications."] })
    );

    await visit("/latest");
    await click("#toggle-current-user");
    await click(DISMISS_NOTIFICATIONS);
    await click(CONFIRM_DISMISS);

    assert
      .dom(".dialog-body")
      .includesText(
        "Unable to dismiss notifications.",
        "shows the server error"
      );
    assert.dom(AVATAR_BADGE).hasText("3", "the avatar count is preserved");
    assert.dom(NOTIFICATION_BADGE).hasText("3", "notifications remain unread");
    assert.dom(MESSAGE_BADGE).hasText("2", "message alerts remain unread");

    await click(".dialog-footer .btn-primary");
    assert.dom(DISMISS_NOTIFICATIONS).isEnabled("the user can retry dismissal");
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .hasAttribute(
        "aria-busy",
        "false",
        "clears the busy state after failure"
      );
  });

  test("pending dismissal prevents duplicate requests after reopening the menu", async function (assert) {
    let pendingRequest;
    pretender.put(
      "/notifications/mark-read",
      (request) => {
        requests.push(request);
        pendingRequest = request;
        return response({ success: true });
      },
      true
    );

    await visit("/latest");
    await publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(1, 0)
    );
    await click("#toggle-current-user");
    const dismissal = click(DISMISS_NOTIFICATIONS);
    await waitFor(`${DISMISS_NOTIFICATIONS}[disabled]`);

    assert
      .dom(DISMISS_NOTIFICATIONS)
      .hasText("Dismissing…", "shows request progress");
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .hasAttribute("aria-busy", "true", "exposes request progress");
    assert
      .dom(AVATAR_BADGE)
      .hasText("1", "does not clear counts while pending");

    const closing = click("#toggle-current-user");
    await waitUntil(() => !find(".aivia-account-menu"));
    const reopening = click("#toggle-current-user");
    await waitFor(`${DISMISS_NOTIFICATIONS}[disabled]`);
    find(DISMISS_NOTIFICATIONS).click();

    assert.strictEqual(
      requests.length,
      1,
      "reopening cannot send a second request"
    );
    pretender.resolve(pendingRequest);
    await Promise.all([dismissal, closing, reopening]);
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .isEnabled("the pending guard resets after success");
  });

  test("a late request response preserves newer notification counts", async function (assert) {
    let pendingRequest;
    pretender.put(
      "/notifications/mark-read",
      (request) => {
        pendingRequest = request;
        return response({ success: true });
      },
      true
    );

    await visit("/latest");
    await publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(1, 0)
    );
    await click("#toggle-current-user");
    const dismissal = click(DISMISS_NOTIFICATIONS);
    await waitFor(`${DISMISS_NOTIFICATIONS}[disabled]`);

    const update = publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(2, 1)
    );
    await waitUntil(() => find(AVATAR_BADGE)?.textContent.trim() === "2");
    pretender.resolve(pendingRequest);
    await Promise.all([dismissal, update]);

    assert
      .dom(AVATAR_BADGE)
      .hasText("2", "a late response preserves the newer total");
    assert
      .dom(NOTIFICATION_BADGE)
      .hasText("2", "new notifications remain visible");
    assert.dom(MESSAGE_BADGE).hasText("1", "new message alerts remain visible");
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

  test("mobile dismissal confirms important alerts and clears server-reported counts", async function (assert) {
    await visit("/latest");
    await click("#toggle-current-user");

    assert
      .dom(DISMISS_NOTIFICATIONS)
      .hasTagName("button", "dismissal is a native keyboard-accessible button");
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .hasAttribute("type", "button", "dismissal does not submit a form");
    await click(DISMISS_NOTIFICATIONS);
    assert
      .dom(".dismiss-notification-confirmation .d-modal__body")
      .hasText(
        i18n("notifications.dismiss_confirmation.body.default", { count: 101 }),
        "mobile uses the full important-notification count"
      );
    await click(CONFIRM_DISMISS);
    await publishToMessageBus(
      `/notification/${loggedInUser().id}`,
      notificationCounts(0, 0)
    );

    assert.dom(AVATAR_BADGE).doesNotExist("the mobile avatar clears");
    assert
      .dom(NOTIFICATION_BADGE)
      .doesNotExist("the mobile notification counter clears");
    assert.dom(MESSAGE_BADGE).doesNotExist("the mobile message counter clears");
    assert
      .dom(DISMISS_NOTIFICATIONS)
      .doesNotExist("dismissal hides after the update");
  });

  test("mobile keeps badges, direct account navigation, and dismissible menu", async function (assert) {
    await visit("/t/internationalization-localization/280");
    assert
      .dom(AVATAR_BADGE)
      .hasText("99+", "large avatar counts fit on mobile");

    await click("#toggle-current-user");
    assert
      .dom(".aivia-account-menu__items > li")
      .exists({ count: 5 }, "navigation and dismissal are available on mobile");
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

  test("mobile navigation exposes translated descriptions and closes with Escape", async function (assert) {
    await visit("/");
    const toggle = '[data-aivia-header-dropdown="primary_menu"]';
    await click(toggle);

    assert
      .dom("#aivia-primary-mobile-menu .aivia-header-nav__section-label")
      .hasText("Explore AIVIA", "labels the navigation group in real markup");
    assert
      .dom("#aivia-primary-mobile-menu .aivia-header-nav__item-subtitle")
      .exists(
        { count: 4 },
        "every primary destination has a readable description"
      );
    assert
      .dom(
        '#aivia-primary-mobile-menu a[href="/aivia/academia"] .aivia-header-nav__item-subtitle'
      )
      .hasText(
        "Map your lab, get insights, connect to industry",
        "renders the lab description alongside its destination"
      );
    await triggerKeyEvent(toggle, "keydown", "Escape");
    assert
      .dom(toggle)
      .hasAttribute(
        "aria-expanded",
        "false",
        "Escape closes the mobile navigation"
      );
  });

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
