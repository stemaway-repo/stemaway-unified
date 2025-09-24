import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.26.0", (api) => {
  const user = api.getCurrentUser();
  if (!user) return;

  api.addQuickAccessProfileItem({
    icon: "id-card",
    href: `/u/${user.username_lower}/resume`,
    content: "Resume",
  });
});
