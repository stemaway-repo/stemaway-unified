import Component from "@glimmer/component";
import { service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";

export default class StemawayFooterBanner extends Component {
  @service router;
  @service siteSettings;

  get canDisplay() {
    const currentRouteName = this.router.currentRouteName;
    if (currentRouteName === `discovery.${defaultHomepage()}`) {
      return true;
    }

    const topMenu = (this.siteSettings.top_menu || "").split("|");
    return topMenu.some((m) => `discovery.${m}` === currentRouteName);
  }
}
