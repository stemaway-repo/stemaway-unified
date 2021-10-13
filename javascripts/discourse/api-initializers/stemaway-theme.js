import { apiInitializer } from 'discourse/lib/api';

export default apiInitializer('0.11.1', (api) => {
  api.reopenWidget('user-menu-links', {
    profileGlyph() {
      const glyph = this._super(...arguments);
      glyph['title'] = 'user.profile';
      return glyph;
    },
  });
});
