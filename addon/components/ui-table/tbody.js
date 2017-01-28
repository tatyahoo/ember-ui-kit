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

  scroller: Ember.computed('scrollable', function() {
    return this.get('scrollable').children('.ui-table__scroller');
  }).readOnly(),

  resize() {
    let table = this.get('table.measurements.height') || 0;
    let thead = this.get('table.thead.measurements.outerHeight') || 0;
    let tfoot = this.get('table.tfoot.measurements.outerHeight') || 0;

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
    },

    parity: {
      render() {
        let scroller = this.get('scroller');

        this.$().on('register.tr', Ember.run.bind(this, function(evt, tr) {
          tr.set('itemIndex', scroller.children().index(tr.$()));
        }));
      },

      destroy() {
        this.$().off('register.tr');
      }
    },
  }
});
