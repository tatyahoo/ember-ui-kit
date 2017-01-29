import Ember from 'ember';
import layout from '../../templates/components/ui-table/tfoot';

import Pluggable from '../../mixins/pluggable';
import Measurable from '../../mixins/measurable';

export default Ember.Component.extend(Pluggable, Measurable, {
  classNames: 'ui-table__tfoot',
  layout,

  // attrs {
  table: null,
  // attrs }

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
      all: scrollable,
      froze: scrollable.froze.children('.ui-table__scroller'),
      unfroze: scrollable.unfroze.children('.ui-table__scroller')
    };
  }).readOnly(),

  resize() {
    let thead = this.get('measurements.scrollHeight');

    this.$()
      .add(this.get('scrollable.all'))
      .height(thead);
  },

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.tfoot', this);
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
