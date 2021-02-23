import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-menu-category",
  initialize() {
    withPluginApi("0.10.1", (api) => {
      //   api.reopenWidget("hamburger-category", {
      //     html(c) {
      //       console.log("This method reached");
      //       if (c.parent_category_id) {
      //         console.log("CID: " + c.parent_category_id);
      //         // Changing .subcategory -> .testChild to see if just changing this works...
      //         this.tagName += ".testChild";
      //         console.log("TN: " + this.tagName);
      //       }
      //       this.tagName += ".category-" + Category.slugFor(c, "-");
      //       console.log("CSF:" + this.tagName);
      //       const results = [
      //         this.attach("category-link", {
      //           category: c,
      //           allowUncategorized: true,
      //         }),
      //       ];
      //       console.log("Results Array below:");
      //       console.log(results);
      //       const unreadTotal =
      //         parseInt(c.get("unreadTopics"), 10) +
      //         parseInt(c.get("newTopics"), 10);
      //       if (unreadTotal) {
      //         results.push(
      //           h(
      //             "a.badge.badge-notification",
      //             {
      //               attributes: { href: c.get("url") },
      //             },
      //             number(unreadTotal)
      //           )
      //         );
      //       }
      //       if (!this.currentUser) {
      //         let count;
      //         if (c.get("show_subcategory_list")) {
      //           count = c.get("totalTopicCount");
      //         } else {
      //           count = c.get("topic_count");
      //         }
      //         results.push(h("b.topics-count", number(count)));
      //       }
      //       return results;
      //     },
      //   });
    });
  },
};
