import Component from "@glimmer/component";
import { service } from "@ember/service";
import I18n from "I18n";


export default class StemawayJumbotronHeader extends Component {
  @service currentUser;

  get hero() {
    const user = this.currentUser;
    const firstGroup = Number(settings.hero_group_1);
    const secondGroup = Number(settings.hero_group_2);

    let activeGroup = 3;

    if (user && Array.isArray(user.groups)) {
      for (const g of user.groups) {
        if (g?.id === firstGroup) {
          activeGroup = 1;
          break;
        }
        if (g?.id === secondGroup) {
          activeGroup = 2;
          break;
        }
      }
    }

    return {
      title: I18n.t(themePrefix(`hero.group_${activeGroup}.title`)),
      subtitle: I18n.t(themePrefix(`hero.group_${activeGroup}.description`)),
    };
  }
}
