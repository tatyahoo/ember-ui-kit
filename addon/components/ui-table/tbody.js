import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody';

import Pluggable from '../../mixins/pluggable';
import Measurable from '../../mixins/measurable';

export default Ember.Component.extend(Pluggable, Measurable, {
  classNames: 'ui-table__tbody',
  layout,

  // attrs {
  // @private
  table: null,
  // attrs }

  thead: Ember.computed.readOnly('table.thead'),
  tbody: Ember.computed.readOnly('table.tbody'),
  tfoot: Ember.computed.readOnly('table.tfoot'),

  scrollable: Ember.computed(function() {
    return this.$().children('.ui-table__scrollable');
  }).readOnly(),

  resize() {
    let table = this.get('table.measurements.height') || 0;
    let thead = this.get('table.thead.measurements.height') || 0;
    let tfoot = this.get('table.tfoot.measurements.height') || 0;

    this.$().css({
      marginTop: thead,
      marginBottom: tfoot,
      height: Math.max(0, table - thead - tfoot)
    });
  },

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.tbody', this);
      }
    }
  }
});
