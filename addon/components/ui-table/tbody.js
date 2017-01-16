import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody';

import Pluggable from '../../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__tbody',
  layout,

  // attrs {
  table: null,
  // attrs }

  thead: Ember.computed.readOnly('table.thead'),
  tbody: Ember.computed.readOnly('table.tbody'),
  tfoot: Ember.computed.readOnly('table.tfoot'),

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.tbody', this);
      }
    }
  }
});
