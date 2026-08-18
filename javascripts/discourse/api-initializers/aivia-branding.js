import { apiInitializer } from "discourse/lib/api";

const ICONS = [
  {
    asset: "aivia_favicon_16",
    rel: "icon",
    sizes: "16x16",
  },
  {
    asset: "aivia_favicon_32",
    rel: "icon",
    sizes: "32x32",
  },
  {
    asset: "aivia_apple_touch_icon",
    rel: "apple-touch-icon",
    sizes: "180x180",
  },
];

function installBrandIcons() {
  ICONS.forEach(({ asset, rel, sizes }) => {
    const href = settings.theme_uploads?.[asset];

    if (!href) {
      return;
    }

    let link = document.head.querySelector(
      `link[data-aivia-brand-icon="${asset}"]`
    );

    if (!link) {
      link = document.createElement("link");
      link.dataset.aiviaBrandIcon = asset;
      document.head.appendChild(link);
    }

    link.rel = rel;
    link.type = "image/png";
    link.sizes = sizes;
    link.href = href;
  });
}

export default apiInitializer(() => {
  installBrandIcons();
});
