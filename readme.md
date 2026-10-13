# STEM-Away&reg; Unified Theme

## About

A theme component to have a unified design language/style for the [STEM-Away&reg; Website](https://stemaway.com)

**Theme Name**: [STEM-Away Unified Theme](https://github.com/stemaway-repo/stemaway-unified/)

**Author**: [Keegan George](https://github.com/keegangeorge)

**This theme is based off of**:

- STEM-Away Engagement Theme by [Jay Pffafman](https://github.com/pfaffman)
- RunTimeTerror NavBar by [James Kiesel](https://github.com/gdpelican) & Others

**Version**: 2.0

## Homepage hero

The hero uses the hiring page's light cream surface (`#fafaf8`) at every viewport
width, with a faint neutral grid. Its `--hero-background` token in
`scss/components/aivia-hero.scss` controls the surface independently of the accent
colors.

## AIVIA navigation

The `home-logo-contents` connector renders the AIVIA wordmark on every Discourse
header, including categories, topics, and user pages. White headers share the
wordmark colors in `scss/components/aivia-wordmark.scss`; dark marketing headers
keep the light wordmark. Workspace styles do not override the logo colors.

My AIVIA appears in the header on every page, including homepage, forum, user,
and admin pages, and for guests. It lists Lab tools, Candidate tools, and any
Hiring tools available to the signed-in user. Candidate links open the matching
dashboard tab or AIVIA resume. Personal tools retain their normal login requirements.
The closed My AIVIA button stays neutral. The menu's expanded state controls its
active appearance, and the current destination is highlighted inside the menu.
Hiring, Academia, Career, and The Tech share My AIVIA's 40px control height,
padding, text scale, corner radius, and hover/active surface. Their current-page
state uses `aria-current="page"` and an underline defined in the shared header
stylesheet, using the theme's green accent. Workspace styles do not add a separate
underline or change Academia's dimensions.
The Discourse hamburger and sidebar toggle are visible only to Discourse admins;
moderators and lab administrators do not qualify unless they are also site admins.
Light workspace headers set `--aivia-header-control-color` to keep My AIVIA and
the retained admin navigation icon readable against their surface.
The avatar menu contains Notifications, Messages, My account, and Log out on
every page, including topics, preferences, and Discourse admin pages. My account
opens `/u/<username>/preferences/account` directly, without a submenu. The menu
uses the core logout action and the existing keyboard and dismissal behavior.
Account menu labels, including Log out, share My AIVIA's menu typography and
responsive text sizes in `scss/layout/header/general.scss`.
The two panels also share their surface, border, corner radius, shadow, and row
hover styles. Account rows keep the same inner gutter, reserve space for unread
badges, and separate Log out with a divider. Legacy Discourse menu styling is
scoped away from the account panel to avoid overriding these shared rules.
Core notification row backgrounds, icon offsets, and the tab-rail border are
reset inside the account panel. Its links own hover and keyboard focus styling;
verify hover on a row that does not hold keyboard focus, since core styles differ
between those states.

Notifications and Messages link to their full lists and show compact red badges
centered vertically at the end of their menu rows. Badge geometry belongs in
`scss/components/aivia-account-menu.scss`; the menu's inline padding token keeps
the badge inset aligned with the row gutter. Avatar badges retain separate corner
positioning and sizing. The avatar shows a combined unread count via the
`user-dropdown-notifications__after` outlet. The notification total already
includes messages, so the two counts are not added together. All badges use the
current user's counters, update through Discourse's notification MessageBus, and
disappear when those counters clear. Counts above 99 display as `99+`; accessible
labels retain the full count. Do not disturb suppresses the avatar badge as in
core. The menu has touch-sized rows and a viewport-bounded scrolling area.
Dismiss all is a compact text-and-checkmark utility aligned to the end of the
Notifications and Messages group. Its separate class avoids navigation-row hover
surfaces; hover and keyboard focus underline the label, and coarse pointers get
a larger touch target. It appears while notifications remain unread, including
previously seen alerts without a new-count badge. It marks all notification
records as read, including message alerts;
it does not mark message topics as read. The theme's `aivia-notification-dismissal`
service uses Discourse's confirmation dialog for important notifications and its
`/notifications/mark-read` endpoint. The service blocks repeat requests even when
the menu is reopened and reports failures through the standard error dialog.
Badge counts come from Discourse's authoritative notification MessageBus updates,
so a completed request cannot erase a newer unread count. Successful dismissal
is announced to screen readers and returns focus to Notifications when the menu
is still open.

Navigation acceptance tests run with `bin/qunit --theme-id <id> --qunit-path
/theme-qunit`. The theme's `tests.requiredPlugins` metadata loads the dependencies
used by its hero and site banner.
Theme QUnit omits theme stylesheets. Tests verify the role class controlling header
visibility; check its rendered appearance on the local site as well.

## Installation

The header menu styles include the October 12 workspace and dashboard email's
navigation refinements. Mobile navigation headings and descriptions are translated
markup in `aivia-header-dropdowns.js`, not CSS-generated content. All dropdown
surfaces use theme palette variables; the mobile backdrop starts below the header
and respects reduced motion. Faculty pages provide local header color variables
and route activity comes from `aria-current`, including hover underlines for
inactive links. Remove the matching admin-editor override blocks after deploying
these styles to avoid their `!important` rules taking precedence. See the UI plugin's
`docs/workspace-dashboard-menu-style-migration.md` for the migration scope.

1. On your discourse website, navigate to:

   ```
   Admin > Customize > Themes
   ```

2. Click `Install` and select `From a git repository`

3. Paste in the following link:
   ```
   https://github.com/stemaway-repo/stemaway-unified.git
   ```
4. Navigate to your current theme and select it

5. Include the `STEM-Away Unified` component on your theme.
