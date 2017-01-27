import Ember from 'ember';
import layout from '../../templates/components/ui-table/thead';

import Pluggable from '../../mixins/pluggable';
import Measurable from '../../mixins/measurable';

export default Ember.Component.extend(Pluggable, Measurable, {
  classNames: 'ui-table__thead',
  layout,

  // attrs {
  table: null,
  // attrs }

  childHeaderList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

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

  availableComputableSpan: Ember.computed('childHeaderLeafList.@each.{span,width}', function() {
    return this.get('childHeaderLeafList').reduce((accum, header) => {
      let { span, width } = header.getProperties('span', 'width');

      if (typeof width === 'number') {
        return accum;
      }

      return accum + span;
    }, 0);
  }).readOnly(),
  availableComputableWidth: Ember.computed('measurements.width', 'childHeaderLeafList.@each.width', function() {
    return this.get('measurements.width') - this.get('childHeaderLeafList').reduce((accum, header) => {
      let width = header.get('width');

      if (typeof width === 'number') {
        return accum + width;
      }

      return accum;
    }, 0);
  }).readOnly(),

  sheet: Ember.computed(function() {
    return this.$('style');
  }).readOnly(),

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
        this.$().off();
      }
    },

    sortable: {
      render() {
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
      }
    },

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
