import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "stemaway-landing-page",
  initialize() {
    withPluginApi("0.6", (api) => {
      api.registerConnectorClass("below-site-header", "experts-homepage", {
        setupComponent(args, component) {
          api.onPageChange((url, title) => {
            if (url == "/") {
              component.set("displayCustomHomepageBlocks", true);
            } else {
              component.set("displayCustomHomepageBlocks", false);
            }

            if (url == "/") {
              $("html").addClass("show-experts-homepage");
              component.set("displayCustomHomepageHeader", true);
            } else {
              $("html").removeClass("show-experts-homepage");
              $("#main-outlet a").click(function () {
                if ($(this).attr("href") == "/") {
                  component.set("displayCustomHomepageHeader", true);
                  $(".below-site-header-outlet.experts-homepage").removeClass(
                    "hidden"
                  );
                }
              });
              $(".d-header .title").click(function () {
                component.set("displayCustomHomepageHeader", true);
                $(".below-site-header-outlet.experts-homepage").removeClass(
                  "hidden"
                );
              });
              component.set("displayCustomHomepageHeader", false);
            }
          });
        },
      });

      api.registerConnectorClass("above-footer", "stemaway-partners-section", {
        setupComponent(args, component) {
          api.onPageChange((url, title) => {
            if (url == "/") {
              component.set("displayPartnersFooter", true);
            } else {
              component.set("displayPartnersFooter", false);
            }

            if (url == "/") {
              $("html").addClass("show-stemaway-partners-section");
              component.set("displayPartnersFooter", true);
            } else {
              $("html").removeClass("stemaway-partners-section");
              $("#main-outlet a").click(function () {
                if ($(this).attr("href") == "/") {
                  component.set("displayPartnersFooter", true);
                  $(
                    ".above-footer-outlet.stemaway-partners-section"
                  ).removeClass("hidden");
                }
              });
              $(".d-header .title").click(function () {
                component.set("displayPartnersFooter", true);
                $(".above-footer-outlet.stemaway-partners-section").removeClass(
                  "hidden"
                );
              });
              component.set("displayPartnersFooter", false);
            }
          });
        },
      });
    });
  },
};
