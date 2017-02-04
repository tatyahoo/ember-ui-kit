import Ember from 'ember';
import layout from '../templates/components/ui-scrollable';

import Composable from '../mixins/composable';

export default Ember.Component.extend(Composable, {
  classNames: 'ui-scrollable',
  layout,

  // attrs {
  ps: false,
  // attrs }

  didRender() {
    this._super(...arguments);

    let ps = this.get('ps');

    if (ps) {
      if (typeof ps === 'boolean') {
        ps = {};
      }

      this.$().addClass('ui-scrollable--ps').perfectScrollbar(ps);
    }
    else {
      this.$().removeClass('ui-scrollable--ps').perfectScrollbar('destroy');
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().perfectScrollbar('destroy');
  },

  update() {
    this.$().perfectScrollbar('update');
  }
});
