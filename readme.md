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
keep the light wordmark. Hiring supplies scoped palette tokens for its light
header without changing the shared logo markup.

My AIVIA appears in the header on every page, including homepage, forum, user,
and admin pages, and for guests. It lists Lab tools, Candidate tools, and any
Hiring tools available to the signed-in user. Candidate links open the matching
dashboard tab or AIVIA resume. Personal tools retain their normal login requirements.
The Hiring workspace entry uses `can_find_hiring_workspace` from the hiring
plugin, with `can_access_hiring_workspace` as a compatibility fallback. Company
members and site admins can still find the entry while the feature is disabled;
it opens a status page without granting access to company tools. Updating the
local theme files requires refreshing the installed development theme before
browser checks or theme QUnit. No live theme update is implied.
Hiring workspace routes use the same primary navigation as the lab workspace,
with Hiring marked as the current destination. The hiring plugin sets light
header and readable wordmark tokens only while `hiring-workspace-page` is active.
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

Notifications and Messages use separate counts. The avatar combines non-message
notification alerts with new/unread private-message conversations, including shared
group inboxes. A conversation addressed to multiple groups counts once; a group
summary alert does not count as another message. Counts over 99 display as `99+`
while accessible labels retain the full number. Do not disturb still suppresses
the avatar badge.

The account panel shows the five most recently active accessible conversations,
with escaped subjects, inbox labels, dates, and unread markers. Opening the panel
does not read notifications or conversations. The Updates heading contains Dismiss
all; My account and Log out have a separate footer. The panel scrolls within the
viewport and retains 44px navigation and utility targets on phones.

The theme's `aivia-account-inbox` service reads
`GET /aivia/account-inbox.json` from `stemaway-ui-addons` on initial load and panel
opening. It coalesces refreshes from the existing notification and private-message
tracking MessageBus channels, including group channels whose summarized alert
count has not changed. Requests are serialized; an event received during a request
queues another refresh. The service cleans up subscriptions and timers and uses no
persistent browser storage. Failures show inline retry without hiding account
actions. The endpoint accepts no target user, rechecks access on every request,
uses the core private-message topic query and tracking report, excludes archived
conversations from recent previews, and returns `Cache-Control: private, no-store`.
Unread status follows Discourse's new/unread conversation tracking preferences.

Dismiss all appears while notification records remain unread, including seen
alerts without a new-count badge. The `aivia-notification-dismissal` service uses
Discourse's confirmation dialog for important alerts and
`PUT /notifications/mark-read`. It dismisses notification records, including group
summaries and personal-message alerts; it does not read message topics. An unread
conversation therefore retains its inbox and avatar count after dismissal. The
service blocks concurrent duplicate requests, reports failures through the standard
error dialog, announces success, and restores focus to Notifications if open.
Server refreshes and notification updates preserve newer arrivals.

This panel requires updating both `stemaway-unified` (theme component) and
`stemaway-ui-addons` (authorized inbox endpoint). No form delivery, email routing,
notification subscription preferences, site settings, or migrations change.

Account inbox QA (November 6, 2026): notification and PM MessageBus arrivals,
unchanged group summaries, late responses, read status, dismissal confirmation and
concurrency, errors/retry, escaped subjects, and admin/member navigation are
covered by the navigation QUnit suite. The UI plugin's
`spec/requests/stemaway_ui_addons/account_inbox_controller_spec.rb` covers
recipient scoping, group membership and revocation, duplicate group recipients,
preview limits, archival/deletion, and read-only behavior. Browser checks used
isolated test conversations at 1280×800, 390×844, and 320×640, confirming no
horizontal overflow and controls at least 44px tall. Actual local admin-inbox
subjects were inspected without reading conversations or dismissing alerts.

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
