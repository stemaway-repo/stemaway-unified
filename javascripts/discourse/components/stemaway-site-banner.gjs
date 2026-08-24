import Component from "@glimmer/component";
import { service } from "@ember/service";
import { defaultHomepage } from "discourse/lib/utilities";
import AiviaBanner from "discourse/plugins/stemaway-project-generation/discourse/components/aivia-banner";
import ComponentsPage from "discourse/plugins/stemaway-tiered-tagging/discourse/components/components-page";
import AiviaHero from "./aivia-hero";

export default class StemawaySiteBanner extends Component {
  @service router;

  get canDisplay() {
    return this.router.currentRouteName === `discovery.${defaultHomepage()}`;
  }

  <template>
{{#if this.canDisplay}}
  <AiviaHero />
  <ComponentsPage />
  <AiviaBanner />
{{/if}}
  </template>
}
