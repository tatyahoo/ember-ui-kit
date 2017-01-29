import Ember from 'ember';
import layout from '../../templates/components/ui-table/thead';

import Pluggable from '../../mixins/pluggable';
import Measurable from '../../mixins/measurable';

import { observerOnce } from '../../utils/run';

export default Ember.Component.extend(Pluggable, Measurable, {
  classNames: 'ui-table__thead',
  layout,

  // attrs {
  table: null,
  // attrs }

  childHeaderList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  childHeaderListFroze: Ember.computed.filterBy('childHeaderList', 'frozen', true).readOnly(),
  childHeaderListUnfroze: Ember.computed.filterBy('childHeaderList', 'frozen', false).readOnly(),

  childHeaderLeafList: Ember.computed('childHeaderList.[]', function() {
    let collect = [];

    (function recur(list) {
      list.forEach(item => {
        if (item.get('isLeafHeader')) {
          collect.push(item);
        }
        else {
          recur(item.get('childHeaderList'));
        }
      });
    })(this.get('childHeaderList'));

    return Ember.A(collect);
  }).readOnly(),

  childHeaderLeafListFroze: Ember.computed.filterBy('childHeaderLeafList', 'frozen', true).readOnly(),
  childHeaderLeafListUnfroze: Ember.computed.filterBy('childHeaderLeafList', 'frozen', false).readOnly(),

  availableComputableSpan: Ember.computed('childHeaderLeafList.@each.span', function() {
    return this.get('childHeaderLeafList').reduce((accum, header) => {
      return accum + header.get('span');
    }, 0);
  }).readOnly(),
  availableComputableWidth: Ember.computed('table.measurements.width', 'childHeaderLeafList.@each.width', function() {
    return this.get('table.measurements.width') - this.get('childHeaderLeafList').reduce((accum, header) => {
      let width = header.get('width');

      if (typeof width === 'number') {
        return accum + width;
      }

      return accum;
    }, 0);
  }).readOnly(),

  frozenColumnWidth: Ember.computed('childHeaderListFroze.@each.columnWidth', function() {
    return this.get('childHeaderListFroze').reduce((accum, th) => {
      return accum + th.get('columnWidth');
    }, 0);
  }).readOnly(),

  unfrozenColumnWidth: Ember.computed('childHeaderListUnfroze.@each.columnWidth', function() {
    return this.get('childHeaderListUnfroze').reduce((accum, th) => {
      return accum + th.get('columnWidth');
    }, 0);
  }).readOnly(),

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

  sheet: Ember.computed(function() {
    return this.$('style');
  }).readOnly(),

  resize() {
    let thead = this.get('measurements.scrollHeight');

    this.$()
      .add(this.get('scrollable.all'))
      .height(thead);
  },

  plugins: {
    register: {
      render() {
        let childHeaderList = this.get('childHeaderList');

        this.$().on('register.th', (evt, th) => {
          childHeaderList.pushObject(th);
        });

        this.$().on('unregister.th', (evt, th) => {
          childHeaderList.removeObject(th);
        });
      },

      afterRender() {
        this.$().trigger('register.thead', this);
      },

      destroy() {
        this.$().off('register.th unregister.th');
      }
    },

    sortable: {
      afterRender() {
        let rows = this.get('table.tbody');

        this.$().on('sortupdate', evt => {
          let order = [];
          let nodes = Ember.$(evt.target).parentsUntil('.ui-table', '.ui-table__th, .ui-table__thead');
          let junction = nodes.first();
          let headers = junction.data('$E').get('childHeaderList');

          junction.children().each(function recur() {
            let element = Ember.$(this);

            if (element.is('.ui-table__th')) {
              order.push(element.data('$E'));
            }
            else {
              element.children().each(recur);
            }
          });

          headers.replace(0, headers.get('length'), order);

          this.notifyPropertyChange('childHeaderLeafList');
        });
      },

      destroy() {
        this.$().off('sortupdate');
      }
    },

    freezable: {
      render() {
        this.addObserver('childHeaderList.@each.frozen', observerOnce(() => {
          this.$().trigger('freezeupdate');
        }));
      },

      afterRender() {
        let th = this.get('childHeaderList');
        let froze = this.get('scroller.froze');

        Ember.run.schedule('render', this, function() {
          this.get('childHeaderLeafList').forEach(th => {
            th.get('frozenMirrorCell').appendTo(froze);
          });
        });

        this.$().on('freezeupdate', evt => {
          let frozeHeaders = this.get('childHeaderLeafListFroze');
          let unfrozeHeaders = this.get('childHeaderLeafListUnfroze');

          frozeHeaders.forEach(th => {
            th.freeze();
          });
          unfrozeHeaders.forEach(th => {
            th.unfreeze();
          });
        });
      },

      destroy() {
        this.$().off('freezeupdate');
      }
    },

    // TODO We can fold this into an AST transform
    textNodes: {
      afterRender() {
        let { TEXT_NODE, ELEMENT_NODE } = document;

        (function recur(nodes) {
          nodes.each((index, node) => {
            switch (node.nodeType) {
              case TEXT_NODE: node.data = node.data.trim(); return;
              case ELEMENT_NODE: recur(Ember.$(node).contents()); return;
            }
          });
        })(this.$().contents());
      }
    }
  }
});
