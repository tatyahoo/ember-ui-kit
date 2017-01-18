import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody';

import Pluggable from '../../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__tbody',
  layout,

  // attrs {
  model: null,

  // @private
  table: null,
  // attrs }

  thead: Ember.computed.readOnly('table.thead'),
  tbody: Ember.computed.readOnly('table.tbody'),
  tfoot: Ember.computed.readOnly('table.tfoot'),

  buffer: Ember.computed.readOnly('model'),
  //buffer: Ember.computed(function() {
  //  return Ember.A();
  //}).readOnly(),

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.tbody', this);
      }
    },

    buffer: {
      afterRender() {
        let buffer = this.get('buffer');
        let model = this.get('model');

        let table = this.get('table').$();
      }
    }
  }
}).reopenClass({
  positionalParams: ['model']
});
