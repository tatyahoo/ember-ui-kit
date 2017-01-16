import Ember from 'ember';
import layout from '../../templates/components/ui-table/tfoot';

import Pluggable from '../../mixins/pluggable';

export default Ember.Component.extend({
  classNames: 'ui-table__tfoot',
  layout,

  // attrs {
  table: null,
  // attrs }

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.tfoot', this);
      }
    }
  }
});
