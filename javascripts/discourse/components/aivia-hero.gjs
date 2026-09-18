/*
  AIVIA hero — Mapper / Universal Search / Evaluator

  Panel ids and data-p letters:
    s → #aivia-s  Mapper            (was "the Mapping"; letter kept so the tab JS is unchanged)
    u → #aivia-u  Universal Search  (NEW panel)
    p → #aivia-p  Evaluator         (was "the Evaluations"; letter kept)
    i → #aivia-i  Hiring Workspace  (not tabbed; unchanged)
    c → #aivia-c  Career Workspace  (not tabbed; unchanged)

  Default "on" tab is the Mapper. The #aivia-headline text, the .dk-t.on button,
  the .dk-mobile-opt.active option, #aivia-mobile-sel-text and the .vw.on panel
  are all set to it below and must stay in sync if you change the default.

  Requires the SCSS additions in aivia-hero-additions.scss.
*/

export default <template>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@500;0,700&display=swap">
<div id="aivia-hero">
  <div class="dk">
    <div class="dk-stage">

      <div class="dk-head">
        <div class="dk-tagline">
          <p class="dk-tagline-main">The index of the technical world.</p>
          <p class="dk-tagline-detail">A living, navigable graph of AI and the engineering around it, with evaluations
            built in.</p>
        </div>
      </div>

      <div class="dk-rotating">
        <p class="dk-rotating-title" id="aivia-headline">Expertise and openings. <em>Mapped.</em></p>
      </div>

      <div class="dk-nav">
        <div class="dk-tab-groups" id="aivia-tabs">
          <div class="dk-tab-cluster dk-tab-cluster--hiring">
            <div class="dk-tabs dk-tabs--hiring" role="tablist" aria-label="AIVIA product previews">
              <button id="aivia-tab-s" class="dk-t on" type="button" role="tab" aria-selected="true"
                aria-controls="aivia-s" data-p="s" data-h="Expertise and openings. <em>Mapped.</em>">Mapper</button>
              <button id="aivia-tab-u" class="dk-t" type="button" role="tab" aria-selected="false"
                aria-controls="aivia-u" tabindex="-1" data-p="u"
                data-h="The whole map. <em>Searchable.</em>">Universal Search</button>
              <button id="aivia-tab-p" class="dk-t" type="button" role="tab" aria-selected="false"
                aria-controls="aivia-p" tabindex="-1" data-p="p"
                data-h="The map writes the <em>evaluation.</em>">Evaluator</button>
            </div>
          </div>
        </div>
      </div>

      <div class="dk-mobile-nav" id="aivia-mobile-nav">
        <button class="dk-mobile-sel" id="aivia-mobile-sel" type="button" aria-expanded="false"
          aria-controls="aivia-mobile-dd" aria-haspopup="listbox">
          <span id="aivia-mobile-sel-text">Mapper</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div class="dk-mobile-dd" id="aivia-mobile-dd">
          <div class="dk-mobile-group">
            <div class="dk-mobile-group-panel" role="listbox" aria-label="AIVIA product previews">
              <button class="dk-mobile-opt active" type="button" role="option" aria-selected="true" data-p="s"
                data-h="Expertise and openings. <em>Mapped.</em>">Mapper</button>
              <button class="dk-mobile-opt" type="button" role="option" aria-selected="false" data-p="u"
                data-h="The whole map. <em>Searchable.</em>">Universal Search</button>
              <button class="dk-mobile-opt" type="button" role="option" aria-selected="false" data-p="p"
                data-h="The map writes the <em>evaluation.</em>">Evaluator</button>
            </div>
          </div>
        </div>
      </div>

      <div class="dk-demo-wrap" id="aivia-demo-wrap">
        <div class="dk-glass">

          {{! ==================== MAPPER: RADAR + MAPPING DEMO ==================== }}
          <div id="aivia-s" class="vw on" role="tabpanel" aria-labelledby="aivia-tab-s">
            <div class="dk-panel dk-panel--mapping">
              <div class="dk-panel-body">
                <div class="dk-panel-header dk-panel-header--mapping">
                  <div class="dk-panel-header-copy">
                    <div class="dk-mapping-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" aria-hidden="true">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      AIVIA MAPPER
                    </div>
                    <p class="dk-panel-sub">“Caching” is a keyword. “KV cache manager” is an AIVIA Component.
                      Components say what someone built, and how it fails.</p>
                  </div>
                </div>

                <div class="dk-cohort-layout">
                  {{! Left: domain radar }}
                  <div class="dk-radar-card">
                    <div class="dk-radar-bg"></div>
                    <div class="dk-radar-layout">
                      <div class="dk-radar-chart">
                        <div class="dk-radar-ring"></div>
                        <div class="dk-radar-sweep"></div>
                        <svg width="300" height="230" viewBox="0 0 300 230">
                          <defs>
                            <linearGradient id="aivia-hex-fill" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stop-color="#8eebcf" stop-opacity="0.7" />
                              <stop offset="55%" stop-color="#4cc4a4" stop-opacity="0.42" />
                              <stop offset="100%" stop-color="#1f7f74" stop-opacity="0.5" />
                            </linearGradient>
                            <filter id="catalog-glow">
                              <feGaussianBlur stdDeviation="2" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                          <g transform="translate(150,110)">
                            <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="none" stroke="#e8e5de"
                              stroke-width="0.5" />
                            <polygon points="0,-53 46,-27 46,27 0,53 -46,27 -46,-27" fill="none" stroke="#e8e5de"
                              stroke-width="0.5" />
                            <polygon points="0,-27 23,-13 23,13 0,27 -23,13 -23,-13" fill="none" stroke="#e8e5de"
                              stroke-width="0.5" />
                            <line x1="0" y1="-80" x2="0" y2="80" stroke="#e8e5de" stroke-width="0.5" />
                            <line x1="-69" y1="-40" x2="69" y2="40" stroke="#e8e5de" stroke-width="0.5" />
                            <line x1="69" y1="-40" x2="-69" y2="40" stroke="#e8e5de" stroke-width="0.5" />
                            <polygon points="0,-80 69,-40 69,40 0,80 -69,40 -69,-40" fill="none" stroke="#2D5A4A"
                              stroke-width="1" stroke-dasharray="5 4" opacity="0.25" />
                            <polygon points="0,-76 46,-24 23,37 0,32 -37,19 -24,-35" fill="rgba(45,90,74,0.1)"
                              stroke="#2D5A4A" stroke-width="2" filter="url(#catalog-glow)" />
                            {{! Top: Frontier Models }}
                            <circle cx="0" cy="-76" r="5" fill="#2D5A4A" class="dk-radar-dot dk-radar-dot--g" />
                            {{! Top-right: LLM & Agents }}
                            <circle cx="46" cy="-24" r="5" fill="#2D5A4A"
                              class="dk-radar-dot dk-radar-dot--g dk-radar-dot--d1" />
                            {{! Bottom-right: Search & Rec }}
                            <circle cx="23" cy="37" r="5" fill="#2D5A4A"
                              class="dk-radar-dot dk-radar-dot--g dk-radar-dot--d2" />
                            {{! Bottom: AI Security }}
                            <circle cx="0" cy="32" r="5" fill="#2D5A4A"
                              class="dk-radar-dot dk-radar-dot--g dk-radar-dot--d3" />
                            {{! Bottom-left: Bio & Clinical AI }}
                            <circle cx="-37" cy="19" r="4.5" fill="#b8860b"
                              class="dk-radar-dot dk-radar-dot--a dk-radar-dot--d4" />
                            {{! Top-left: Robotics & AV }}
                            <circle cx="-24" cy="-35" r="4.5" fill="#b8860b"
                              class="dk-radar-dot dk-radar-dot--a dk-radar-dot--d5" />
                          </g>
                          <text x="150" y="15" text-anchor="middle" font-size="10" font-weight="600"
                            fill="#2D5A4A">Frontier Models</text>
                          <text x="232" y="73" text-anchor="start" font-size="10" font-weight="600"
                            fill="#2D5A4A">LLM &amp; Agents</text>
                          <text x="232" y="157" text-anchor="start" font-size="10" font-weight="600"
                            fill="#2D5A4A">Search &amp; Rec</text>
                          <text x="150" y="224" text-anchor="middle" font-size="10" font-weight="600"
                            fill="#2D5A4A">AI Security</text>
                          <text x="42" y="153" text-anchor="middle" font-size="10" font-weight="600" fill="#b8860b">
                            <tspan x="42" dy="0">Bio &amp;</tspan>
                            <tspan x="42" dy="12">Clinical AI</tspan>
                          </text>
                          <text x="68" y="73" text-anchor="end" font-size="10" font-weight="600"
                            fill="#b8860b">Robotics &amp; AV</text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {{! Right: mapping demo — resume line → keywords vs Components → failure modes }}
                  <div class="dk-chat dk-map-demo">
                    <div class="dk-activity-header">
                      <div class="dk-activity-title">
                        <span class="dk-activity-pulse"></span>
                        <span>Mapper</span>
                      </div>
                    </div>
                    <div class="dk-map-demo__body">
                      <div class="dk-map-demo__source">
                        <span class="dk-map-demo__label">From a resume</span>
                        <p class="dk-map-demo__quote">Built KV-cache management for an LLM serving stack; redesigned
                          eviction under memory pressure and cut p99 latency by 60%.</p>
                      </div>

                      <div class="dk-map-demo__row">
                        <span class="dk-map-demo__label">AIVIA Components</span>
                        <div class="dk-msg-tags">
                          <span class="dk-tag dk-tag--purple dk-tag--lg">KV cache manager</span>
                          <span class="dk-tag dk-tag--purple dk-tag--lg">Transformer serving runtime</span>
                        </div>
                      </div>

                      <div class="dk-map-demo__row">
                        <span class="dk-map-demo__label">Failure modes</span>
                        <div class="dk-msg-tags">
                          <span class="dk-tag dk-tag--green dk-tag--lg">KV cache eviction failure</span>
                          <span class="dk-tag dk-tag--green dk-tag--lg">Latency tail spike</span>
                        </div>
                      </div>
                    </div>
                    <p class="dk-map-demo__footer">Same map for resumes, job posts, repos, and papers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {{! ==================== UNIVERSAL SEARCH ==================== }}
          <div id="aivia-u" class="vw" role="tabpanel" aria-labelledby="aivia-tab-u" aria-hidden="true">
            <div class="dk-panel dk-panel--search">
              <div class="dk-panel-body">
                <div class="dk-panel-header dk-panel-header--search">
                  <div class="dk-panel-header-copy">
                    <div class="dk-mapping-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" aria-hidden="true">
                        <circle cx="11" cy="11" r="6" />
                        <path d="M16 16l3.5 3.5" />
                      </svg>
                      AIVIA SEARCH
                    </div>
                    <p class="dk-panel-sub">One search box for everything on the map.</p>
                  </div>
                </div>

                <div class="dk-search">
                  <div class="dk-search__box" role="img"
                    aria-label="Search box showing the query: inference cache eviction under memory pressure">
                    <span class="dk-search__icon" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.5-3.5" />
                      </svg>
                    </span>
                    <span class="dk-search__query">inference cache eviction under memory pressure</span>
                    <span class="dk-search__go" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                  <div class="dk-search__meta-row">
                    <span class="dk-search__note">Indexed by AIVIA Components.</span>
                    <span class="dk-search__count">6 results · people, roles, labs, papers, talks, repos</span>
                  </div>
                  <div class="dk-search__matched">
                    <span class="dk-search__matched-label">Matched components</span>
                    <span class="dk-tag dk-tag--purple dk-tag--lg"><i class="dk-hit dk-hit--kv" aria-hidden="true"></i>KV cache manager</span>
                    <span class="dk-tag dk-tag--purple dk-tag--lg"><i class="dk-hit dk-hit--rt" aria-hidden="true"></i>Transformer serving runtime</span>
                  </div>

                  <ul class="dk-search__results" aria-label="Example search results">
                    <li class="dk-search__result dk-search__result--people">
                      <span class="dk-search__head">
                        <span class="dk-search__type">People</span>
                        <span class="dk-search__hits" role="img" aria-label="Matched on KV cache manager"><i class="dk-hit dk-hit--kv" title="Matched on KV cache manager"></i></span>
                      </span>
                      <span class="dk-search__name">Priya N.</span>
                      <span class="dk-search__meta">Inference systems · 8 yrs</span>
                      <span class="dk-search__badge dk-search__badge--verified">
                        <span class="dk-search__badge-title"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>AIVIA Evaluated</span>
                        <span class="dk-search__badge-evidence"><b>Evaluation evidence:</b> Diagnosed cache eviction under memory pressure</span>
                      </span>
                    </li>
                    <li class="dk-search__result dk-search__result--role">
                      <span class="dk-search__head">
                        <span class="dk-search__type">Role</span>
                        <span class="dk-search__hits" role="img" aria-label="Matched on KV cache manager"><i class="dk-hit dk-hit--kv" title="Matched on KV cache manager"></i></span>
                      </span>
                      <span class="dk-search__name">Senior Engineer, LLM Inference</span>
                      <span class="dk-search__meta">Open · Hybrid</span>
                      <span class="dk-search__badge dk-search__badge--ready">AIVIA eval ready</span>
                    </li>
                    <li class="dk-search__result dk-search__result--lab">
                      <span class="dk-search__head">
                        <span class="dk-search__type">Lab</span>
                        <span class="dk-search__hits" role="img" aria-label="Matched on Transformer serving runtime, KV cache manager"><i class="dk-hit dk-hit--rt" title="Matched on Transformer serving runtime"></i><i class="dk-hit dk-hit--kv" title="Matched on KV cache manager"></i></span>
                      </span>
                      <span class="dk-search__name">Inference Systems Group</span>
                      <span class="dk-search__meta">4 papers on the map</span>
                      <span class="dk-search__badge dk-search__badge--ready">2 AIVIA evaluated</span>
                    </li>
                    <li class="dk-search__result dk-search__result--paper">
                      <span class="dk-search__head">
                        <span class="dk-search__type">Paper</span>
                        <span class="dk-search__hits" role="img" aria-label="Matched on KV cache manager"><i class="dk-hit dk-hit--kv" title="Matched on KV cache manager"></i></span>
                      </span>
                      <span class="dk-search__name">Eviction policies for long-context serving</span>
                      <span class="dk-search__meta">2026</span>
                    </li>
                    <li class="dk-search__result dk-search__result--talk">
                      <span class="dk-search__head">
                        <span class="dk-search__type">Talk</span>
                        <span class="dk-search__hits" role="img" aria-label="Matched on KV cache manager"><i class="dk-hit dk-hit--kv" title="Matched on KV cache manager"></i></span>
                      </span>
                      <span class="dk-search__name">Serving 1M-token contexts without eviction storms</span>
                      <span class="dk-search__meta">MLSys 2026 · workshop</span>
                    </li>
                    <li class="dk-search__result dk-search__result--repo">
                      <span class="dk-search__head">
                        <span class="dk-search__type">Repo</span>
                        <span class="dk-search__hits" role="img" aria-label="Matched on KV cache manager"><i class="dk-hit dk-hit--kv" title="Matched on KV cache manager"></i></span>
                      </span>
                      <span class="dk-search__name">paged-kv</span>
                      <span class="dk-search__meta">Open source · 2.1k stars</span>
                    </li>

                  </ul>
                </div>
              </div>
            </div>
          </div>

          {{! ==================== EVALUATOR ==================== }}
          <div id="aivia-p" class="vw" role="tabpanel" aria-labelledby="aivia-tab-p" aria-hidden="true">
            <div class="dk-panel dk-panel--evaluations">
              <div class="dk-panel-body">
                <div class="dk-panel-header dk-panel-header--evaluations">
                  <div class="dk-panel-header-copy">
                    <div class="dk-mapping-label">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2.5" aria-hidden="true">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      AIVIA EVALUATOR
                    </div>
                    <p class="dk-panel-sub">Resumes claim. The map knows what to test. The evaluation turns claims
                      into evidence.</p>
                  </div>
                </div>
                <div class="dk-prescreen-split">
                  {{! Left: map breadcrumb + rubric card + link block }}
                  <div class="dk-prescreen-left">
                    <div class="dk-eval-crumb">
                      <span class="dk-eval-crumb__label">Mapped to</span>
                      <span class="dk-eval-crumb__path">KV cache manager<span class="dk-eval-crumb__sep">›</span>eviction
                        under memory pressure</span>
                    </div>

                    <div class="dk-rubric-card">
                      <div class="dk-rubric-header">
                        <div class="dk-rubric-title">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d5a4a"
                            stroke-width="2">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                          <span>Rubric</span>
                        </div>
                        <button class="dk-rubric-customize">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Customize
                        </button>
                      </div>
                      <div class="dk-rubric-body">
                        <div class="dk-rubric-section">
                          <div class="dk-rubric-section-label">
                            <span>Fixed dimensions</span>
                          </div>
                          <div class="dk-rubric-chips">
                            <span class="dk-rubric-chip">Isolation<span class="dk-chip-x">×</span></span>
                            <span class="dk-rubric-chip">Evidence<span class="dk-chip-x">×</span></span>
                            <span class="dk-rubric-chip">Impact<span class="dk-chip-x">×</span></span>
                          </div>
                        </div>
                        <div class="dk-rubric-section">
                          <div class="dk-rubric-section-label">
                            <span>From the map</span>
                          </div>
                          <div class="dk-rubric-chips">
                            <span class="dk-rubric-chip dk-rubric-chip--wildcard">KV cache eviction failure<span
                                class="dk-chip-x dk-chip-x--wildcard">×</span></span>
                            <span class="dk-rubric-chip dk-rubric-chip--wildcard">Memory pressure<span
                                class="dk-chip-x dk-chip-x--wildcard">×</span></span>
                            <span class="dk-rubric-chip-add">+ Add</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="dk-link-block">
                      <div class="dk-link-label">Evaluation link ready</div>
                      <div class="dk-link-url-wrap">
                        <span class="dk-link-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                        </span>
                        <span class="dk-link-url">aivia.app/e/kv-cache-debug-a7f2</span>
                        <button class="dk-link-copy-btn">Copy</button>
                      </div>
                    </div>
                  </div>

                  {{! Right: live eval }}
                  <div class="dk-eval-panel">
                    <div class="dk-eval-topbar">
                      <div class="dk-eval-brand"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="#34d399" stroke-width="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg><span class="dk-eval-name">AIVIA · Adaptive probe</span><span
                          class="dk-eval-dot"></span><span class="dk-eval-status">Evaluating</span></div>
                      <div class="dk-eval-timer"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                          stroke="#64748b" stroke-width="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg><span>4:42</span></div>
                    </div>
                    <div class="dk-eval-progress">
                      <div class="dk-eval-step dk-eval-step--active">
                        <div class="dk-eval-circle dk-eval-circle--active">1</div><span>Q1</span>
                      </div>
                      <div class="dk-eval-line dk-eval-line--done"></div>
                      <div class="dk-eval-step">
                        <div class="dk-eval-circle">2</div><span>Q2</span>
                      </div>
                      <div class="dk-eval-line"></div>
                      <div class="dk-eval-step">
                        <div class="dk-eval-circle">3</div><span>Q3</span>
                      </div>
                      <div class="dk-eval-line"></div>
                      <div class="dk-eval-step">
                        <div class="dk-eval-circle dk-eval-circle--icon"><svg width="9" height="9" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          </svg></div><span>Voice</span>
                      </div>
                    </div>
                    <div class="dk-eval-q">Walk me through debugging hot-entry eviction under memory pressure.</div>
                    <div class="dk-eval-a-wrap">
                      <div class="dk-eval-a">I'd check eviction policy metrics against the memory threshold first.</div>
                    </div>
                    <div class="dk-eval-rubric-scoring">
                      <div class="dk-eval-scoring-title">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2.5">
                          <path d="M9 11l3 3L22 4" />
                        </svg>
                        Rubric scoring
                      </div>
                      <div class="dk-eval-bars">
                        <div class="dk-eval-bar-row">
                          <span class="dk-eval-bar-label">Isolation</span>
                          <div class="dk-eval-bar-track">
                            <div class="dk-eval-bar-fill" style="width: 100%"></div>
                          </div>
                          <span class="dk-eval-bar-score">5/5</span>
                        </div>
                        <div class="dk-eval-bar-row">
                          <span class="dk-eval-bar-label">Evidence</span>
                          <div class="dk-eval-bar-track">
                            <div class="dk-eval-bar-fill dk-eval-bar-fill--amber" style="width: 60%"></div>
                          </div>
                          <span class="dk-eval-bar-score">3/5</span>
                        </div>
                        <div class="dk-eval-bar-row">
                          <span class="dk-eval-bar-label">KV cache eviction failure</span>
                          <div class="dk-eval-bar-track">
                            <div class="dk-eval-bar-fill" style="width: 100%"></div>
                          </div>
                          <span class="dk-eval-bar-score">5/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {{! ==================== HIRING WORKSPACE (not tabbed; unchanged) ==================== }}
          <div id="aivia-i" class="vw">
            <div class="dk-panel">
              <div class="dk-panel-body">
                <div class="dk-hiring-workspace">
                  <div class="dk-hiring-breadcrumb">
                    <span class="dk-hiring-breadcrumb-path">AIVIA hiring assistant</span>
                    <span class="dk-hiring-breadcrumb-separator">›</span>
                    <span class="dk-hiring-breadcrumb-role">Autonomy Safety Engineer</span>
                    <span class="dk-hiring-status">Mapped</span>
                  </div>

                  <div class="dk-hiring-mapping">
                    <div class="dk-hiring-mapping-header">
                      <span>Evaluation mapping</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0-4-4L4 16v4" />
                        <path d="m13.5 6.5 4 4" />
                      </svg>
                    </div>
                    <div class="dk-hiring-mapping-body">
                      <div class="dk-hiring-mapping-label">Engineering components</div>
                      <div class="dk-hiring-pill-row">
                        <span class="dk-hiring-pill">perception_eval_framework</span>
                        <span class="dk-hiring-pill">safety_watchdog</span>
                        <span class="dk-hiring-pill">safety_case_evidence_system</span>
                      </div>
                      <div class="dk-hiring-mapping-label">Failure modes</div>
                      <div class="dk-hiring-pill-row">
                        <span class="dk-hiring-pill dk-hiring-pill--failure">perception_eval_slice_blindness</span>
                        <span class="dk-hiring-pill dk-hiring-pill--failure">release_gate_mismatch</span>
                      </div>
                    </div>
                  </div>

                  <div class="dk-hiring-stage-grid">
                    <div class="dk-hiring-stage">
                      <div class="dk-hiring-stage-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round">
                          <path d="M7 20h10M6 6l6-1 6 1M12 3v17M9 12 6 6l-3 6a3 3 0 0 0 6 0M21 12l-3-6-3 6a3 3 0 0 0 6 0" />
                        </svg>
                      </div>
                      <span>Talent search &amp; rank</span>
                    </div>
                    <div class="dk-hiring-stage">
                      <div class="dk-hiring-stage-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <span>Adaptive AI prescreening</span>
                    </div>
                    <div class="dk-hiring-stage">
                      <div class="dk-hiring-stage-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="9" cy="7" r="4" />
                          <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" />
                        </svg>
                      </div>
                      <span>Proactive talent watch</span>
                    </div>
                    <div class="dk-hiring-stage">
                      <div class="dk-hiring-stage-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                          stroke-linecap="round" stroke-linejoin="round">
                          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                          <rect x="9" y="3" width="6" height="4" rx="2" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <span>Instant interview kit</span>
                    </div>
                  </div>

                  <div class="dk-hiring-chat-input">
                    <span>Ask me anything about this role…</span>
                    <div class="dk-hiring-chat-send" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {{! ==================== CAREER WORKSPACE (not tabbed; rubric labels updated to match Evaluator) ==================== }}
          <div id="aivia-c" class="vw">
            <div class="dk-panel">
              <div class="dk-panel-body">
                <div class="dk-panel-header">
                  <div class="dk-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg> Your portfolio</div>
                  <p class="dk-panel-sub">Verified results you own and control</p>
                </div>

                <div class="dk-portfolio-stack">
                  <div class="dk-portfolio-left">
                    <div class="dk-eval-card">
                      <div class="dk-eval-card-accent"></div>
                      <div class="dk-eval-card-inner">
                        <div class="dk-eval-card-header">
                          <div>
                            <div class="dk-eval-card-title">KV cache manager: emphasis on debug</div>
                            <div class="dk-eval-card-date">Completed Apr 2, 2026</div>
                          </div>
                          <div class="dk-level-badge">
                            <div class="dk-level-ring">
                              <div class="dk-level-inner">
                                <div class="dk-level-label">Level</div>
                                <div class="dk-level-num">3</div>
                              </div>
                            </div>
                            <div class="dk-level-text">Proficient</div>
                          </div>
                        </div>

                        <div class="dk-scores-row">
                          <span class="dk-scores-label">Fixed rubric:</span>
                          <span class="dk-score"><span class="dk-score-dot"></span>Isolation <b>5/5</b></span>
                          <span class="dk-score-sep">·</span>
                          <span class="dk-score"><span class="dk-score-dot dk-score-dot--amber"></span>Evidence
                            <b>3/5</b></span>
                          <span class="dk-score-more">...</span>
                        </div>
                        <div class="dk-scores-row">
                          <span class="dk-scores-label">From the map:</span>
                          <span class="dk-score"><span class="dk-score-dot"></span>KV cache eviction failure <b>5/5</b></span>
                          <span class="dk-score-more">...</span>
                        </div>

                        <div class="dk-resume-section">
                          <div class="dk-resume-label">Resume tags</div>
                          <div class="dk-resume-tags">
                            <span class="dk-resume-tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                                stroke="#5b21b6" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg> Technical depth</span>
                            <span class="dk-resume-tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                                stroke="#5b21b6" stroke-width="2">
                                <path
                                  d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                              </svg> Systematic reasoning</span>
                            <span class="dk-resume-tag"><svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                                stroke="#5b21b6" stroke-width="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                              </svg> Diagnostic instinct</span>
                          </div>
                        </div>

                        <div class="dk-action-bar">
                          <div class="dk-actions-left">
                            <div class="dk-action"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="#2D5A4A" stroke-width="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg><span>Detailed report</span></div>
                            <div class="dk-action"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="#2D5A4A" stroke-width="1.5">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                              </svg><span>Voice</span><svg width="8" height="8" viewBox="0 0 24 24" fill="none"
                                stroke="#2D5A4A" stroke-width="2.5">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg></div>
                            <div class="dk-action"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="#2D5A4A" stroke-width="1.5">
                                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                                <polyline points="16 6 12 2 8 6" />
                                <line x1="12" y1="2" x2="12" y2="15" />
                              </svg><span>Share</span></div>
                          </div>
                          <div class="dk-actions-right">
                            <span class="dk-toggle-label">On resume</span>
                            <div class="dk-toggle">
                              <div class="dk-toggle-knob"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="dk-eval-card dk-eval-card--peek">
                      <div class="dk-eval-card-accent"></div>
                      <div class="dk-eval-card-inner">
                        <div class="dk-eval-card-header">
                          <div>
                            <div class="dk-eval-card-title">Vector search optimizer: query rewriter focus</div>
                            <div class="dk-eval-card-date">Completed Mar 18, 2026</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="dk-assistant-card">
                    <div class="dk-assistant-card-accent"></div>
                    <div class="dk-assistant-card-header">
                      <div class="dk-assistant-card-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white"
                          stroke-width="1.8">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <div class="dk-assistant-card-copy">
                        <div class="dk-assistant-card-name">AI Career Assistant</div>
                        <div class="dk-assistant-card-desc">Verified career guidance from your AIVIA results</div>
                      </div>
                    </div>
                    <div class="dk-assistant-card-prompts">
                      <div class="dk-assistant-card-prompt"><span class="dk-assistant-card-arrow">›</span>Match my evals
                        to a job</div>
                      <div class="dk-assistant-card-prompt"><span class="dk-assistant-card-arrow">›</span>Prepare me for
                        an interview</div>
                      <div class="dk-assistant-card-prompt"><span class="dk-assistant-card-arrow">›</span>How can I
                        improve?</div>
                    </div>
                    <a href="#" class="dk-assistant-card-cta">Start a conversation</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <section class="dk-component-showcase" aria-label="Example AIVIA components">
        <p class="dk-component-showcase__intro">
          <span class="dk-component-showcase__lead">A peek into AIVIA’s component map: core AI domains and the
            engineering around them.</span>
          <span class="dk-component-showcase__follow">Every component: <em>search by it</em>, <em>grade on it</em>,
            <em>ask about it</em>.</span>
        </p>
        <div class="dk-component-showcase__track">
          <button class="dk-component-tile dk-component-tile--agentic" type="button" aria-expanded="false"
            data-component="Agent loop controller">
            <span class="dk-component-tile__inner">
              <span class="dk-component-tile__front">
                <span class="dk-component-tile__icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.8">
                    <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
                  </svg>
                </span>
                <span class="dk-component-tile__name">Agent loop controller</span>
                <span class="dk-component-tile__domain">LLM &amp; Agentic Systems</span>
                <span class="dk-component-tile__seen">Mapped from job postings at: Microsoft · Together AI · Decagon</span>
                <span class="dk-component-tile__cue">↗ See failure modes</span>
              </span>
              <span class="dk-component-tile__back">
                <span class="dk-component-tile__back-label">Failure modes</span>
                <span class="dk-component-tile__back-name">Agent loop controller</span>
                <span class="dk-component-tile__desc">Runs the core agent loop: reason with the LLM, execute a tool, repeat until done.</span>
                <span class="dk-component-tile__failure">Agent infinite tool loop</span>
                <span class="dk-component-tile__failure">Reasoning-action mismatch</span>
                <span class="dk-component-tile__back-cue">↗ Flip back</span>
              </span>
            </span>
          </button>
          <button class="dk-component-tile dk-component-tile--retrieval" type="button" aria-expanded="false"
            data-component="RAG pipeline">
            <span class="dk-component-tile__inner">
              <span class="dk-component-tile__front">
                <span class="dk-component-tile__icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.8">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
                  </svg>
                </span>
                <span class="dk-component-tile__name">RAG pipeline</span>
                <span class="dk-component-tile__domain">LLM &amp; Agentic Systems</span>
                <span class="dk-component-tile__seen">Mapped from job postings at: Airbnb · ServiceNow · Google</span>
                <span class="dk-component-tile__cue">↗ See failure modes</span>
              </span>
              <span class="dk-component-tile__back">
                <span class="dk-component-tile__back-label">Failure modes</span>
                <span class="dk-component-tile__back-name">RAG pipeline</span>
                <span class="dk-component-tile__desc">Retrieves relevant documents and feeds them to an LLM for grounded, accurate responses.</span>
                <span class="dk-component-tile__failure">Stale document confidence</span>
                <span class="dk-component-tile__failure">Citation misattribution</span>
                <span class="dk-component-tile__back-cue">↗ Flip back</span>
              </span>
            </span>
          </button>
          <button class="dk-component-tile dk-component-tile--mlops" type="button" aria-expanded="false"
            data-component="HIL validation platform">
            <span class="dk-component-tile__inner">
              <span class="dk-component-tile__front">
                <span class="dk-component-tile__icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.8">
                    <path d="M12 2L3 7l9 5 9-5-9-5z" />
                    <path d="M3 12l9 5 9-5M3 17l9 5 9-5" />
                  </svg>
                </span>
                <span class="dk-component-tile__name">HIL validation platform</span>
                <span class="dk-component-tile__domain">MLOps &amp; ML Platform</span>
                <span class="dk-component-tile__seen">Mapped from job postings at: Anduril · Figure · Aurora</span>
                <span class="dk-component-tile__cue">↗ See failure modes</span>
              </span>
              <span class="dk-component-tile__back">
                <span class="dk-component-tile__back-label">Failure modes</span>
                <span class="dk-component-tile__back-name">HIL validation platform</span>
                <span class="dk-component-tile__desc">Tests embedded hardware and integrated systems against simulated environments, including bench rigs, scenario execution, signal capture, and regression triage.</span>
                <span class="dk-component-tile__failure">HIL bench-vehicle divergence</span>
                <span class="dk-component-tile__failure">HIL scenario coverage gap</span>
                <span class="dk-component-tile__back-cue">↗ Flip back</span>
              </span>
            </span>
          </button>
          <button class="dk-component-tile dk-component-tile--effectiveness" type="button" aria-expanded="false"
            data-component="Requirements translation">
            <span class="dk-component-tile__inner">
              <span class="dk-component-tile__front">
                <span class="dk-component-tile__icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.8">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 22v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
                  </svg>
                </span>
                <span class="dk-component-tile__name">Requirements translation</span>
                <span class="dk-component-tile__domain">Engineering Effectiveness</span>
                <span class="dk-component-tile__seen">Mapped from job postings at: Amazon · Datadog · Snowflake</span>
                <span class="dk-component-tile__cue">↗ See failure modes</span>
              </span>
              <span class="dk-component-tile__back">
                <span class="dk-component-tile__back-label">Failure modes</span>
                <span class="dk-component-tile__back-name">Requirements translation</span>
                <span class="dk-component-tile__desc">Turns ambiguous business requirements into precise technical scope with clear assumptions.</span>
                <span class="dk-component-tile__failure">Unstated assumption becomes requirement</span>
                <span class="dk-component-tile__failure">Acceptance criteria drift</span>
                <span class="dk-component-tile__back-cue">↗ Flip back</span>
              </span>
            </span>
          </button>
        </div>
      </section>

    </div>
  </div>
</div>
</template>
