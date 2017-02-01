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
    let scrollers = this.$().children('.ui-table__scrollable');

    return {
      all: scrollers,
      froze: scrollers.filter('.ui-table__froze'),
      unfroze: scrollers.filter('.ui-table__unfroze')
    };
  }).readOnly(),

  scroller: Ember.computed('scrollable', function() {
    let scrollable = this.get('scrollable');

    return {
      all: scrollable.all.children('.ui-table__scroller'),
      froze: scrollable.froze.children('.ui-table__scroller'),
      unfroze: scrollable.unfroze.children('.ui-table__scroller')
    };
  }).readOnly(),

  resize() {
    let table = this.get('table.measurements.height') || 0;
    let thead = this.get('table.thead.measurements.scrollHeight') || 0;
    let tfoot = this.get('table.tfoot.measurements.scrollHeight') || 0;

    this.$().css({
      top: thead,
      bottom: tfoot
    });

    this.get('scrollable.all').css({
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
        let unfroze = this.get('scroller.unfroze');

        this.$().on('register.tr', (evt, tr) => {
          Ember.run.join(tr, tr.set, 'itemIndex', unfroze.children().index(tr.$()));
        });
      },

      destroy() {
        this.$().off('register.tr');
      }
    },

    freezable: {
      render() {
        let froze = this.get('scroller.froze');

        this.$().on('register.tr', (evt, tr) => {
          froze.append(tr.get('frozenMirrorRow'));
        });
      },

      destroy() {
        this.$().off('register.tr');
      }
    }
  }
});
