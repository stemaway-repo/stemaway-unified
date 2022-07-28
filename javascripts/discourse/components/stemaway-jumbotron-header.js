import GlimmerComponent from "discourse/components/glimmer";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import I18n from "I18n";
import { tracked } from "@glimmer/tracking";

export default class StemawayJumbotronHeader extends GlimmerComponent {
  get hero() {
    const currentUser = this.currentUser;
    const groups = currentUser?.groups;
    const firstGroup = Number(settings.hero_group_1);
    const secondGroup = Number(settings.hero_group_2);
    let activeGroup = 3;

    if (currentUser) {
      if (
        groups.some((g) => {
          if (g.id === firstGroup) {
            activeGroup = 1;
          } else if (g.id === secondGroup) {
            activeGroup = 2;
          }
        })
      );
    }

    return {
      title: I18n.t(themePrefix(`hero.group_${activeGroup}.title`)),
      subtitle: I18n.t(themePrefix(`hero.group_${activeGroup}.description`)),
    };
  }
}
