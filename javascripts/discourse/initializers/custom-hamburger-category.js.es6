import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-menu-category",
  initialize() {
    withPluginApi("0.10.1", (api) => {
      // api.reopenWidget("hamburger-category", {
      //   // tagName: "li.category-linker",
      // });
    });
  },
};
