import Ember from 'ember';
import layout from '../../templates/components/ui-table/th';

import Pluggable from '../../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__th',
  classNameBindings: 'columnClass',
  layout,

  // attrs {
  width: null,
  span: 1,

  // @private
  table: null,
  // @private
  thead: null,
  // attrs }

  columnClass: Ember.computed.oneWay('elementId'),
  columnWidth: Ember.computed('width', 'span', 'thead', function() {
    return 150;
  }).readOnly(),

  childHeaderList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  isLeafHeader: Ember.computed.empty('childHeaderList'),

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.th', this);
      },

      willDestroyElement() {
        this.$().trigger('unregister.th', this);
      }
    }
  }
});
