import { tracked } from "@glimmer/tracking";
import { cancel, debounce, next } from "@ember/runloop";
import Service, { service } from "@ember/service";
import { ajax } from "discourse/lib/ajax";
import { bind } from "discourse/lib/decorators";

export default class AiviaAccountInbox extends Service {
  @service currentUser;
  @service messageBus;

  @tracked data;
  @tracked isLoading = false;
  @tracked hasError = false;

  constructor() {
    super(...arguments);

    this.channels = [
      `/notification/${this.currentUser.id}`,
      `/private-message-topic-tracking-state/user/${this.currentUser.id}`,
      ...(this.currentUser.groups || []).map(
        (group) => `/private-message-topic-tracking-state/group/${group.id}`
      ),
    ];
    this.channels.forEach((channel) =>
      this.messageBus.subscribe(channel, this.scheduleRefresh)
    );
    this.initialLoad = next(this, this.load);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    cancel(this.initialLoad);
    cancel(this.refreshTimer);
    this.channels.forEach((channel) =>
      this.messageBus.unsubscribe(channel, this.scheduleRefresh)
    );
  }

  get notificationCount() {
    return (
      this.data?.notification_count ??
      Math.max(
        0,
        (this.currentUser.get("all_unread_notifications_count") || 0) -
          (this.currentUser.get("new_personal_messages_notifications_count") ||
            0)
      )
    );
  }

  get messageCount() {
    return (
      this.data?.message_count ??
      this.currentUser.get("new_personal_messages_notifications_count") ??
      0
    );
  }

  get unreadCount() {
    return this.notificationCount + this.messageCount;
  }

  @bind
  scheduleRefresh() {
    if (this.pendingRequest) {
      this.refreshAgain = true;
      return;
    }
    this.refreshTimer = debounce(this, this.refresh, 100);
  }

  refresh() {
    if (this.pendingRequest) {
      this.refreshAgain = true;
      return this.pendingRequest;
    }
    return this.load();
  }

  load() {
    if (this.pendingRequest || this.isDestroying || this.isDestroyed) {
      return this.pendingRequest;
    }

    this.isLoading = true;
    this.hasError = false;
    this.pendingRequest = this.fetchInbox();
    return this.pendingRequest;
  }

  async fetchInbox() {
    try {
      const data = await ajax("/aivia/account-inbox.json");
      if (!this.isDestroying && !this.isDestroyed) {
        this.data = data;
      }
    } catch (error) {
      if (!this.isDestroying && !this.isDestroyed) {
        this.hasError = true;
        if ([403, 404].includes(error.jqXHR?.status)) {
          this.data = undefined;
        }
      }
    } finally {
      this.pendingRequest = null;
      if (!this.isDestroying && !this.isDestroyed) {
        this.isLoading = false;
        if (this.refreshAgain) {
          this.refreshAgain = false;
          this.scheduleRefresh();
        }
      }
    }
  }
}
