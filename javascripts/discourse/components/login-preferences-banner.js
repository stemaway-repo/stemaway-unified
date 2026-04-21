/* global themePrefix */

import Component from "@glimmer/component";
import { service } from "@ember/service";
import { i18n } from "discourse-i18n";

export default class LoginPreferencesBanner extends Component {
  @service router;
  @service currentUser;

  get canDisplay() {
    return (
      !this.currentUser && this.router.currentRouteName === "login-preferences"
    );
  }

  get title() {
    return i18n(themePrefix("login_preferences_banner.title"));
  }

  get body() {
    return i18n(themePrefix("login_preferences_banner.body"));
  }
}
