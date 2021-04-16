import { withPluginApi } from "discourse/lib/plugin-api";
export default {
  name: "user-menu",
  initialize() {
    withPluginApi("0.10.1", (api) => {
      const QuickAccess = {
        PROFILE: "profile",
      };

      // api.reopenWidget("user-menu", {
      //   defaultState() {
      //     const current = this._super();
      //     current.currentQuickAccess = QuickAccess.PROFILE;
      //     return current;
      //   },
      // });
    });
  },
};
