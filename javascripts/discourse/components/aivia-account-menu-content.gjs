/* global themePrefix */

import Component from "@glimmer/component";
import { concat } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { service } from "@ember/service";
import routeAction from "discourse/helpers/route-action";
import getURL from "discourse/lib/get-url";
import DRelativeDate from "discourse/ui-kit/d-relative-date";
import dConcatClass from "discourse/ui-kit/helpers/d-concat-class";
import dIcon from "discourse/ui-kit/helpers/d-icon";
import { i18n } from "discourse-i18n";

export default class AiviaAccountMenuContent extends Component {
  @service aiviaAccountInbox;
  @service aiviaNotificationDismissal;
  @service currentUser;

  get notificationCount() {
    const count = this.aiviaAccountInbox.notificationCount;
    return count > 99 ? "99+" : count;
  }

  get messageCount() {
    const count = this.aiviaAccountInbox.messageCount;
    return count > 99 ? "99+" : count;
  }

  get messages() {
    return (this.aiviaAccountInbox.data?.messages || []).map((message) => ({
      ...message,
      inboxLabel: message.group_names.length
        ? i18n(themePrefix("aivia_header_nav.group_inbox"), {
            group: message.group_names.join(", "),
          })
        : i18n(themePrefix("aivia_header_nav.personal_inbox")),
    }));
  }

  @action
  loadMessages() {
    return this.aiviaAccountInbox.load();
  }

  @action
  async dismissNotifications(event) {
    const menu = event.currentTarget.closest(".aivia-account-menu__content");
    if ((await this.aiviaNotificationDismissal.dismiss()) && menu.isConnected) {
      menu.querySelector(".aivia-account-menu__link")?.focus();
    }
  }

  <template>
    <div
      class="aivia-account-menu__content"
      role="group"
      aria-label={{i18n (themePrefix "aivia_header_nav.account_menu")}}
      {{didInsert this.loadMessages}}
      ...attributes
    >
      <div class="aivia-account-menu__heading">
        <h2 class="aivia-account-menu__heading-title">{{i18n
            (themePrefix "aivia_header_nav.updates")
          }}</h2>
        {{#if this.aiviaNotificationDismissal.showDismiss}}
          <button
            type="button"
            class="aivia-account-menu__dismiss-button"
            disabled={{this.aiviaNotificationDismissal.isDismissing}}
            aria-disabled={{if
              this.aiviaNotificationDismissal.isBusy
              "true"
              "false"
            }}
            aria-busy={{if
              this.aiviaNotificationDismissal.isDismissing
              "true"
              "false"
            }}
            title={{i18n
              (themePrefix "aivia_header_nav.dismiss_notifications_tooltip")
            }}
            {{on "click" this.dismissNotifications}}
          >
            {{dIcon "check"}}
            <span>
              {{#if this.aiviaNotificationDismissal.isDismissing}}
                {{i18n
                  (themePrefix "aivia_header_nav.dismissing_notifications")
                }}
              {{else}}
                {{i18n (themePrefix "aivia_header_nav.dismiss_notifications")}}
              {{/if}}
            </span>
          </button>
        {{/if}}
      </div>
      <ul class="aivia-account-menu__items">
        <li>
          <a
            class="aivia-account-menu__link"
            href={{getURL (concat this.currentUser.path "/notifications")}}
            title={{i18n
              (themePrefix "aivia_header_nav.notifications_with_unread")
              count=this.aiviaAccountInbox.notificationCount
            }}
            aria-label={{i18n
              (themePrefix "aivia_header_nav.notifications_with_unread")
              count=this.aiviaAccountInbox.notificationCount
            }}
          >
            {{dIcon "bell"}}
            <span>{{i18n (themePrefix "aivia_header_nav.notifications")}}</span>
            {{#if this.aiviaAccountInbox.notificationCount}}
              <span class="aivia-account-menu__count" aria-hidden="true">
                {{this.notificationCount}}
              </span>
            {{/if}}
          </a>

        </li>
        <li>
          <a
            class="aivia-account-menu__link"
            href={{getURL (concat this.currentUser.path "/messages")}}
            title={{i18n
              (themePrefix "aivia_header_nav.messages_with_unread")
              count=this.aiviaAccountInbox.messageCount
            }}
            aria-label={{i18n
              (themePrefix "aivia_header_nav.messages_with_unread")
              count=this.aiviaAccountInbox.messageCount
            }}
          >
            {{dIcon "envelope"}}
            <span>{{i18n (themePrefix "aivia_header_nav.messages")}}</span>
            {{#if this.aiviaAccountInbox.messageCount}}
              <span class="aivia-account-menu__count" aria-hidden="true">
                {{this.messageCount}}
              </span>
            {{/if}}
          </a>
        </li>
      </ul>

      <section
        class="aivia-account-menu__inbox"
        aria-label={{i18n (themePrefix "aivia_header_nav.recent_messages")}}
        aria-busy={{if this.aiviaAccountInbox.isLoading "true" "false"}}
      >
        <h2 class="aivia-account-menu__section-title">{{i18n
            (themePrefix "aivia_header_nav.recent_messages")
          }}</h2>
        {{#if this.aiviaAccountInbox.hasError}}
          <div class="aivia-account-menu__status" role="status">
            <span>{{i18n (themePrefix "aivia_header_nav.inbox_error")}}</span>
            <button
              type="button"
              class="aivia-account-menu__retry"
              {{on "click" this.loadMessages}}
            >{{i18n (themePrefix "aivia_header_nav.inbox_retry")}}</button>
          </div>
        {{else if this.messages.length}}
          <ul class="aivia-account-menu__messages">
            {{#each this.messages key="id" as |message|}}
              <li>
                <a
                  class={{dConcatClass
                    "aivia-account-menu__message"
                    (if message.unread "is-unread")
                  }}
                  href={{getURL message.url}}
                >
                  <span
                    class="aivia-account-menu__message-title"
                  >{{message.title}}</span>
                  <span class="aivia-account-menu__message-meta">
                    <span>{{message.inboxLabel}}</span>
                    <DRelativeDate @date={{message.last_posted_at}} />
                  </span>
                  {{#if message.unread}}
                    <span class="aivia-account-menu__unread-dot"><span
                        class="sr-only"
                      >{{i18n
                          (themePrefix "aivia_header_nav.unread_message")
                        }}</span></span>
                  {{/if}}
                </a>
              </li>
            {{/each}}
          </ul>
        {{else if this.aiviaAccountInbox.isLoading}}
          <p class="aivia-account-menu__status" role="status">{{i18n
              (themePrefix "aivia_header_nav.inbox_loading")
            }}</p>
        {{else}}
          <p class="aivia-account-menu__status">{{i18n
              (themePrefix "aivia_header_nav.inbox_empty")
            }}</p>
        {{/if}}
      </section>

      <ul class="aivia-account-menu__items aivia-account-menu__footer">
        <li>
          <a
            class="aivia-account-menu__link"
            href={{getURL
              (concat this.currentUser.path "/preferences/account")
            }}
          >
            {{dIcon "user"}}
            <span>{{i18n (themePrefix "aivia_header_nav.my_account")}}</span>
          </a>
        </li>
        <li class="aivia-account-menu__logout">
          <button
            type="button"
            class="aivia-account-menu__link"
            {{on "click" (routeAction "logout")}}
          >
            {{dIcon "right-from-bracket"}}
            <span>{{i18n (themePrefix "aivia_header_nav.logout")}}</span>
          </button>
        </li>
      </ul>
    </div>
  </template>
}
