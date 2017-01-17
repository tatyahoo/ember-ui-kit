import Ember from 'ember';
import layout from '../templates/components/ui-sortable';

import Pluggable from '../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-sortable',
  layout,

  // attrs {
  options: null,
  // attrs }

  plugins: {
    ui: {
      render() {
        this.$().sortable(Ember.assign({}, this.get('options')));
      },

      destroy() {
        this.$().sortable('destroy');
      }
    }
  }
});
