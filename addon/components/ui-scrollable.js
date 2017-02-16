import Ember from 'ember';
import layout from '../templates/components/ui-scrollable';

import Composable from '../mixins/composable';

export default Ember.Component.extend(Composable, {
  classNames: 'ui-scrollable',
  layout,

  // attrs {
  ps: false,
  // attrs }

  ui: {
    init() {
      let ps = this.get('ps');
      let scrollable = this.$().addClass('ui-scrollable--ps');
      let viewport = this.$().children('.ui-scrollable__viewport')
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
      this.$().children('.ui-scrollable__viewport').perfectScrollbar('update');
    },

    destroy() {
      let viewport = this.$().children('.ui-scrollable__viewport').get(0);

      this.$().removeClass(viewport.className.split(/\s+/).slice(1).concat('ui-scrollable--ps').join(' '));
      this.$().children('.ui-scrollable__viewport').perfectScrollbar('destroy');
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

  update() {
    this.ui.update.call(this);
  }
});
