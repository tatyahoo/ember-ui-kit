import Ember from 'ember';
import layout from '../../templates/components/ui-table/tr';

import Pluggable from '../../mixins/pluggable';

import { observerOnce } from '../../utils/run';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__tr',
  classNameBindings: ['even:ui-table__tr--even', 'odd:ui-table__tr--odd'],
  layout,

  // attrs {
  // @private
  table: null,
  // @private
  tbody: null,
  // @private
  tfoot: null,
  // @private
  bufferIndex: null,
  // @private
  itemIndex: null,
  // attrs }

  tcontainer: Ember.computed('tbody', 'tfoot', function() {
    let tbody = this.get('tbody');
    let tfoot = this.get('tfoot');

    Ember.assert('tr cannot have both tbody and tfoot', !(tbody && tfoot));

    return tbody || tfoot;
  }).readOnly(),

  odd: Ember.computed('itemIndex', function() {
    return this.get('itemIndex') % 2;
  }).readOnly(),

  even: Ember.computed.not('odd').readOnly(),

  childCellList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  childCellListFroze: Ember.computed('table.thead.childHeaderListFroze.[]'/* key is indirect on purpose */, function() {
    let cells = this.get('childCellList');
    let leaves = this.get('table.thead.childHeaderLeafList').filterBy('frozen', true);

    return leaves.map(leaf => {
      return cells.findBy('th', leaf);
    });
  }).readOnly(),

  childCellListUnfroze: Ember.computed('table.thead.childHeaderListUnfroze.[]'/* key is indirect on purpose */, function() {
    let cells = this.get('childCellList');
    let leaves = this.get('table.thead.childHeaderLeafList').filterBy('frozen', false);

    return leaves.map(leaf => {
      return cells.findBy('th', leaf);
    });
  }).readOnly(),

  frozenMirrorRow: Ember.computed(function() {
    return this.$('.ui-table__tr--froze');
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
        let ns = this.get('elementId');
        let cells = this.get('childCellList');

        this.get('table').$().on(`sortupdate.${ns}`, evt => {
          // TODO optimize repaint by moving just the elements that needs to change order
          // TODO sort mirror cells too
          this.$().append(Ember.$(this.get('childCellListUnfroze').map(el => el.element)));
        });
      },

      destroy() {
        let ns = this.get('elementId');

        this.get('table').$().off(`sortupdate.${ns}`);
      }
    },

    freezable: {
      render() {
        let mirror = this.get('frozenMirrorRow');

        this.$().on('register.td', (evt, td) => {
          Ember.run.schedule('afterRender', this, function() {
            td.get('frozenMirrorCell').appendTo(mirror);
          });
        });
      },

      afterRender() {
        let ns = this.get('elementId');
        let froze = this.get('tcontainer.scroller.froze');

        this.get('table').$().on(`freezeupdate.${ns}`, evt => {
          let frozeCells = this.get('childCellListFroze');
          let unfrozeCells = this.get('childCellListUnfroze');

          frozeCells.forEach(cell => {
            cell.freeze();
          });
          unfrozeCells.forEach(cell => {
            cell.unfreeze();
          });
        });
      },

      destroy() {
        let ns = this.get('elementId');

        this.get('table').$().off(`freezeupdate.${ns}`);
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
