import Component from "@glimmer/component";
import { service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";

export default class StemawaySiteBanner extends Component {
  @service router;

  get canDisplay() {
    return this.router.currentRouteName === `discovery.${defaultHomepage()}`;
  }
}
