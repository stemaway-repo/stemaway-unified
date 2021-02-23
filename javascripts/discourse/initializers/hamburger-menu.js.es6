import { withPluginApi } from "discourse/lib/plugin-api";
export default {
  name: "hamburger-menu",
  initialize() {
    withPluginApi("0.10.0", (api) => {
      api.replaceIcon("bars", "ellipsis-v");
    });
  },
};
