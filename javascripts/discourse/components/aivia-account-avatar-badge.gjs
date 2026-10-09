/* global themePrefix */

import Component from "@glimmer/component";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import didUpdate from "@ember/render-modifiers/modifiers/did-update";
import { service } from "@ember/service";
import { i18n } from "discourse-i18n";

export default class AiviaAccountAvatarBadge extends Component {
  @service currentUser;
  @service notifications;

  get unreadCount() {
    // The notification total already includes personal messages.
    return Math.max(
      this.currentUser.get("all_unread_notifications_count") || 0,
      this.currentUser.get("new_personal_messages_notifications_count") || 0
    );
  }

  get displayCount() {
    return this.unreadCount > 99 ? "99+" : this.unreadCount;
  }

  @action
  updateLabel(element) {
    const button = element.closest("button");
    const label = this.unreadCount
      ? i18n(themePrefix("aivia_header_nav.account_menu_with_unread"), {
          count: this.unreadCount,
        })
      : i18n(themePrefix("aivia_header_nav.account_menu"));
    button?.setAttribute("aria-label", label);
    button?.setAttribute("title", label);
  }

  <template>
    <span
      class="aivia-account-menu__avatar-status"
      aria-hidden="true"
      {{didInsert this.updateLabel}}
      {{didUpdate this.updateLabel this.unreadCount}}
      ...attributes
    >
      {{#unless this.notifications.isInDoNotDisturb}}
        {{#if this.unreadCount}}
          <span class="aivia-account-menu__avatar-count">
            {{this.displayCount}}
          </span>
        {{/if}}
      {{/unless}}
    </span>
  </template>
}
