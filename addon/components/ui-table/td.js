import Ember from 'ember';
import layout from '../../templates/components/ui-table/td';

import Pluggable from '../../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__td',
  classNameBindings: 'columnClass',
  layout,

  // attrs {
  // @private
  table: null,
  // @private
  tbody: null,
  // @private
  tr: null,
  // @private
  th: null,
  // attrs }

  columnClass: Ember.computed.readOnly('th.columnClass'),

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.td', this);
      }
    }
  }
});
