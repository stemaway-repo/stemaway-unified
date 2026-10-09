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

Notifications and Messages link to their full lists and show red badges in the
upper right of their menu items. The avatar shows a combined unread count via the
`user-dropdown-notifications__after` outlet. The notification total already
includes messages, so the two counts are not added together. All badges use the
current user's counters, update through Discourse's notification MessageBus, and
disappear when those counters clear. Counts above 99 display as `99+`; accessible
labels retain the full count. Do not disturb suppresses the avatar badge as in
core. The menu has touch-sized rows and a viewport-bounded scrolling area.

Navigation acceptance tests run with `bin/qunit --theme-id <id> --qunit-path
/theme-qunit`. The theme's `tests.requiredPlugins` metadata loads the dependencies
used by its hero and site banner.
Theme QUnit omits theme stylesheets. Tests verify the role class controlling header
visibility; check its rendered appearance on the local site as well.

## Installation

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
