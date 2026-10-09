/* global themePrefix */

import Component from "@glimmer/component";
import { concat } from "@ember/helper";
import { on } from "@ember/modifier";
import { service } from "@ember/service";
import routeAction from "discourse/helpers/route-action";
import getURL from "discourse/lib/get-url";
import dIcon from "discourse/ui-kit/helpers/d-icon";
import { i18n } from "discourse-i18n";

export default class AiviaAccountMenuContent extends Component {
  @service currentUser;

  get notificationCount() {
    const count = this.currentUser.get("all_unread_notifications_count");
    return count > 99 ? "99+" : count;
  }

  get messageCount() {
    const count = this.currentUser.get(
      "new_personal_messages_notifications_count"
    );
    return count > 99 ? "99+" : count;
  }

  <template>
    <ul
      class="aivia-account-menu__items"
      aria-label={{i18n (themePrefix "aivia_header_nav.account_menu")}}
      ...attributes
    >
      <li>
        <a
          class="aivia-account-menu__link"
          href={{getURL (concat this.currentUser.path "/notifications")}}
          title={{i18n
            (themePrefix "aivia_header_nav.notifications_with_unread")
            count=this.currentUser.all_unread_notifications_count
          }}
          aria-label={{i18n
            (themePrefix "aivia_header_nav.notifications_with_unread")
            count=this.currentUser.all_unread_notifications_count
          }}
        >
          {{dIcon "bell"}}
          <span>{{i18n (themePrefix "aivia_header_nav.notifications")}}</span>
          {{#if this.currentUser.all_unread_notifications_count}}
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
            count=this.currentUser.new_personal_messages_notifications_count
          }}
          aria-label={{i18n
            (themePrefix "aivia_header_nav.messages_with_unread")
            count=this.currentUser.new_personal_messages_notifications_count
          }}
        >
          {{dIcon "envelope"}}
          <span>{{i18n (themePrefix "aivia_header_nav.messages")}}</span>
          {{#if this.currentUser.new_personal_messages_notifications_count}}
            <span class="aivia-account-menu__count" aria-hidden="true">
              {{this.messageCount}}
            </span>
          {{/if}}
        </a>
      </li>
      <li>
        <a
          class="aivia-account-menu__link"
          href={{getURL (concat this.currentUser.path "/preferences/account")}}
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
  </template>
}
