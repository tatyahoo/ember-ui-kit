import Ember from 'ember';
import layout from '../templates/components/ui-scrollable';

import Composable from '../mixins/composable';

export default Ember.Component.extend(Composable, {
  classNames: 'ui-scrollable',
  layout,

  // attrs {
  ps: false,
  // attrs }

  didInsertElement() {
    this._super(...arguments);

    let ps = this.get('ps');

    if (ps) {
      if (typeof ps === 'boolean') {
        ps = {};
      }

      let scrollable = this.$().addClass('ui-scrollable--ps');
      let viewport = this.$().children('.ui-scrollable__viewport')
        .perfectScrollbar(ps)
        .get(0);
      let rails = scrollable
        .find('.ps-scrollbar-x-rail, .ps-scrollbar-y-rail')
        .insertAfter(viewport)
        .toArray();

      this.$().addClass(viewport.className.split(/\s+/).slice(1).join(' '));

      viewport.contains = function(element) {
        return rails.includes(element) || HTMLElement.prototype.contains.call(this, element);
      };
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().children('.ui-scrollable__viewport').perfectScrollbar('destroy');
  },

  update() {
    this.$().children('.ui-scrollable__viewport').perfectScrollbar('update');
  }
});
