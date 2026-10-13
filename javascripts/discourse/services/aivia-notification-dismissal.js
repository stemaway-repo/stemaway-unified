/* global themePrefix */

import { tracked } from "@glimmer/tracking";
import Service, { service } from "@ember/service";
import DismissNotificationConfirmationModal from "discourse/components/modal/dismiss-notification-confirmation";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { postRNWebviewMessage } from "discourse/lib/utilities";
import { i18n } from "discourse-i18n";

export default class AiviaNotificationDismissal extends Service {
  @service a11y;
  @service currentUser;
  @service modal;

  @tracked isBusy = false;
  @tracked isDismissing = false;

  get hasUnreadNotifications() {
    return (
      this.currentUser.get("all_unread_notifications_count") > 0 ||
      this.currentUser.get("new_personal_messages_notifications_count") > 0 ||
      this.currentUser.get("unread_high_priority_notifications") > 0 ||
      Object.values(
        this.currentUser.get("grouped_unread_notifications") || {}
      ).some((count) => count > 0)
    );
  }

  get showDismiss() {
    return this.hasUnreadNotifications || this.isBusy;
  }

  async dismiss() {
    if (this.isBusy || !this.hasUnreadNotifications) {
      return false;
    }

    this.isBusy = true;

    try {
      const importantCount = this.currentUser.get(
        "unread_high_priority_notifications"
      );

      if (importantCount > 0) {
        let confirmed = false;
        await this.modal.show(DismissNotificationConfirmationModal, {
          model: {
            confirmationMessage: i18n(
              "notifications.dismiss_confirmation.body.default",
              { count: importantCount }
            ),
            dismissNotifications: () => (confirmed = true),
          },
        });

        if (!confirmed) {
          return false;
        }
      }

      this.isDismissing = true;
      await ajax("/notifications/mark-read", { type: "PUT" });

      // The notification MessageBus updates counts, including new arrivals.
      postRNWebviewMessage("markRead", "1");
      this.a11y.announce(
        i18n(themePrefix("aivia_header_nav.notifications_dismissed"))
      );
      return true;
    } catch (error) {
      popupAjaxError(error);
      return false;
    } finally {
      this.isBusy = false;
      this.isDismissing = false;
    }
  }
}
