import Ember from 'ember';
import layout from '../../templates/components/ui-table/tr';

import Pluggable from '../../mixins/pluggable';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__tr',
  layout,

  // attrs {
  // @private
  table: null,
  // @private
  tbody: null,
  // attrs }

  childCellList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  plugins: {
    register: {
      render() {
        let childCellList = this.get('childCellList');

        this.$().on('register.td', (evt, td) => {
          Ember.run.join(childCellList, childCellList.pushObject, td);

          return false;
        });
      },

      afterRender() {
        this.$().trigger('register.tr', this);
      },

      destroy() {
        this.$().trigger('unregister.tr', this);
        this.$().off('register.td');
      }
    },

    column: {
      afterRender() {
        let headers = this.get('table.thead.childHeaderLeafList');
        let cells = this.get('childCellList');

        Ember.assert('The number of headers and number cells per row does not match', headers.get('length') === cells.get('length'));

        for (let index = 0, len = cells.get('length'); index < len; index++) {
          cells.objectAt(index).set('th', headers.objectAt(index));
        }
      }
    },

    sortable: {
      afterRender() {
        let cells = this.get('childCellList');

        this.get('table.thead').$().on('sortupdate', evt => {
          let columns = this.get('table.thead.childHeaderLeafList');
          let elements = cells
            .sort((left, right) => columns.indexOf(left.get('th')) - columns.indexOf(right.get('th')))
            .map(cell => cell.element);

          // TODO optimize repaint by moving just the elements that needs to change order
          this.$().append(elements);
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
