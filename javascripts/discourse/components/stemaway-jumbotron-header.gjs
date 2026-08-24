/* global settings themePrefix */

import Component from "@glimmer/component";
import { service } from "@ember/service";
import { trustHTML } from "@ember/template";
import { i18n } from "discourse-i18n";

export default class StemawayJumbotronHeader extends Component {
  @service currentUser;

  get rotationStyle() {
    return trustHTML(`--jl-rotate: ${settings.hero_links_rotate_ms}ms;`);
  }

  get hero() {
    const user = this.currentUser;
    const firstGroup = Number(settings.hero_group_1);
    const secondGroup = Number(settings.hero_group_2);

    let activeGroup = 3;

    if (user && Array.isArray(user.groups)) {
      for (const g of user.groups) {
        if (g?.id === firstGroup) {
          activeGroup = 1;
          break;
        }
        if (g?.id === secondGroup) {
          activeGroup = 2;
          break;
        }
      }
    }

    return {
      title: i18n(themePrefix(`hero.group_${activeGroup}.title`)),
      subtitle: i18n(themePrefix(`hero.group_${activeGroup}.description`)),
    };
  }

  <template>
    <section
      class="homepage-jumbotron experts-homepage"
      style={{this.rotationStyle}}
    >
  <div class="jumbotron">
    <div class="jumbotron-image">
      <img loading="lazy" src={{settings.hero_image}} alt="" />
    </div>

    <div class="jumbotron-titles jl-titles">
      {{#if settings.hero_slide_1_enabled}}
        <div class="jl-title-window">
          <h1>{{settings.hero_title_1}}</h1>
          <h2>{{settings.hero_subtitle_1}}</h2>
        </div>
      {{/if}}
      {{#if settings.hero_slide_2_enabled}}
        <div class="jl-title-window">
          <h1>{{settings.hero_title_2}}</h1>
          <h2>{{settings.hero_subtitle_2}}</h2>
        </div>
      {{/if}}
      {{#if settings.hero_slide_3_enabled}}
        <div class="jl-title-window">
          <h1>{{settings.hero_title_3}}</h1>
          <h2>{{settings.hero_subtitle_3}}</h2>
        </div>
      {{/if}}
    </div>

      <div class="jumbotron-quick-links" style={{this.rotationStyle}}>
      <input class="jl-toggle" type="radio" name="jl-quick-links" id="jl-1" />
      <input class="jl-toggle" type="radio" name="jl-quick-links" id="jl-2" />
      <input class="jl-toggle" type="radio" name="jl-quick-links" id="jl-3" />

      <div class="jl-slides">
        {{#if settings.hero_slide_1_enabled}}
          <div class="jumbotron-quick-links-window" id="jl-slide-1">
            <div class="jumbotron-quick-links-container">
              <h3>{{trustHTML settings.hero_links_title}}</h3>
              <ul>
                <li>
                  <a href={{settings.hero_link_1_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero_link_1_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero_link_1_icon}}"></use>
                    </svg>{{settings.hero_link_1_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero_link_2_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero_link_2_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero_link_2_icon}}"></use>
                    </svg>{{settings.hero_link_2_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero_link_3_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero_link_3_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero_link_3_icon}}"></use>
                    </svg>{{settings.hero_link_3_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero_link_4_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero_link_4_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero_link_4_icon}}"></use>
                    </svg>{{settings.hero_link_4_title}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        {{/if}}

        {{#if settings.hero_slide_2_enabled}}
          <div class="jumbotron-quick-links-window" id="jl-slide-2">
            <div class="jumbotron-quick-links-container">
              <h3>{{trustHTML settings.hero_links_title_2}}</h3>
              <ul>
                <li>
                  <a href={{settings.hero2_link_1_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero2_link_1_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero2_link_1_icon}}"></use>
                    </svg>{{settings.hero2_link_1_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero2_link_2_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero2_link_2_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero2_link_2_icon}}"></use>
                    </svg>{{settings.hero2_link_2_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero2_link_3_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero2_link_3_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero2_link_3_icon}}"></use>
                    </svg>{{settings.hero2_link_3_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero2_link_4_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero2_link_4_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero2_link_4_icon}}"></use>
                    </svg>{{settings.hero2_link_4_title}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        {{/if}}

        {{#if settings.hero_slide_3_enabled}}
          <div class="jumbotron-quick-links-window" id="jl-slide-3">
            <div class="jumbotron-quick-links-container">
              <h3>{{trustHTML settings.hero_links_title_3}}</h3>
              <ul>
                <li>
                  <a href={{settings.hero3_link_1_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero3_link_1_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero3_link_1_icon}}"></use>
                    </svg>{{settings.hero3_link_1_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero3_link_2_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero3_link_2_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero3_link_2_icon}}"></use>
                    </svg>{{settings.hero3_link_2_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero3_link_3_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero3_link_3_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero3_link_3_icon}}"></use>
                    </svg>{{settings.hero3_link_3_title}}
                  </a>
                </li>
                <li>
                  <a href={{settings.hero3_link_4_url}}>
                    <svg class="fa d-icon d-icon-{{settings.hero3_link_4_icon}} svg-icon svg-node" aria-hidden="true">
                      <use xlink:href="#{{settings.hero3_link_4_icon}}"></use>
                    </svg>{{settings.hero3_link_4_title}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        {{/if}}
      </div>

      <div class="jl-dots" role="tablist" aria-label="Quick links slides">
        <label class="jl-dot" for="jl-1" role="tab" aria-controls="jl-slide-1" tabindex="0"></label>
        <label class="jl-dot" for="jl-2" role="tab" aria-controls="jl-slide-2" tabindex="0"></label>
        <label class="jl-dot" for="jl-3" role="tab" aria-controls="jl-slide-3" tabindex="0"></label>
      </div>
    </div>
  </div>
</section>
  </template>
}
