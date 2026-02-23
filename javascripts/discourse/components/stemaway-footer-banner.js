import Component from '@ember/component';
import { inject as service } from '@ember/service';
import discourseComputed from 'discourse-common/utils/decorators';
import { defaultHomepage } from 'discourse/lib/utilities';

export default Component.extend({
  router: service(),
  tagName: '',

  @discourseComputed('router.currentRouteName')
  canDisplay(currentRouteName) {
    if (currentRouteName === `discovery.${defaultHomepage()}`) {
      return true;
    } else if (
      this.siteSettings.top_menu
        .split('|')
        .any((m) => `discovery.${m}` === currentRouteName)
    ) {
      return true;
    } else {
      return false;
    }
  },
});
