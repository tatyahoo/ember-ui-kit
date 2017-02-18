import Ember from 'ember';
import layout from '../templates/components/ui-scrollable';

import Composable from '../mixins/composable';

/**
 * @module component
 * @class ui-scrollable
 * @public
 */
export default Ember.Component.extend(Composable, {
  classNames: 'ui-scrollable',
  layout,

  // attrs {

  /**
   * options hash for [perfect-scrollbar](https://github.com/noraesae/perfect-scrollbar#optional-parameters)
   *
   * - Set to `false` to disable perfect-scrollbar and use native scroll.
   * - Set to `true` to enable perfect-scrollbar without any options. This is default.
   * - Optionally pass in an option hash to enable different features on perfect-scrollbar.
   *
   * @attribute options
   * @default true
   * @type boolean|object
   */
  options: true,

  // attrs }

  viewport: Ember.computed(function() {
    return this.$().children('.ui-scrollable__viewport');
  }).readOnly(),

  ui: {
    init() {
      let ps = this.get('ps');
      let scrollable = this.$().addClass('ui-scrollable--ps');
      let viewport = this.get('viewport')
        .perfectScrollbar(typeof ps === 'boolean' ? {} : ps)
        .get(0);
      let rails = scrollable
        .find('.ps-scrollbar-x-rail, .ps-scrollbar-y-rail')
        .insertAfter(viewport)
        .toArray();

      this.$().addClass(viewport.className.split(/\s+/).slice(1).join(' '));

      viewport.contains = function(element) {
        return rails.includes(element) || HTMLElement.prototype.contains.call(this, element);
      };
    },

    update() {
      this.get('viewport').perfectScrollbar('update');
    },

    destroy() {
      let viewport = this.get('viewport');

      this.$().removeClass(viewport.attr('class').split(/\s+/).slice(1).concat('ui-scrollable--ps').join(' '));
      viewport.perfectScrollbar('destroy');
    }
  },

  didRender() {
    this._super(...arguments);

    let ps = this.get('ps');

    if (ps) {
      this.ui.init.call(this);
    }
    else {
      this.ui.destroy.call(this);
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this.ui.destroy.call(this);
  },

  scrollTop(value) {
    let viewport = this.get('viewport');
    let scrollTop = viewport.scrollTop();

    // scrolling down
    if (value > scrollTop) {
      viewport
        .scrollTop(value)
        .trigger('ps-scroll-down')
        .trigger('ps-scroll-y');
    }
    // scrolling up
    else if (value < scrollTop) {
      viewport
        .scrollTop(value)
        .trigger('ps-scroll-up')
        .trigger('ps-scroll-y');
    }
  },

  scrollLeft(value) {
    let viewport = this.get('viewport');
    let scrollLeft = viewport.scrollLeft();

    // scrolling right
    if (value > scrollLeft) {
      viewport
        .scrollLeft(value)
        .trigger('ps-scroll-right')
        .trigger('ps-scroll-x');
    }
    // scrolling left
    else if (value < scrollLeft) {
      viewport
        .scrollLeft(value)
        .trigger('ps-scroll-left')
        .trigger('ps-scroll-x');
    }
  },

  update() {
    this.ui.update.call(this);
  }
});
