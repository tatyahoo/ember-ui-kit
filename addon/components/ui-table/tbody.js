import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody';

import { observerOnceIn } from '../../utils/run';
import { construct } from '../../utils/computed';

export default Ember.Component.extend({
  classNames: 'ui-table__tbody',
  layout,

  // attrs {
  // @private
  table: null,
  // attrs }

  thead: Ember.computed.readOnly('table.thead'),
  tbody: Ember.computed.readOnly('table.tbody'),
  tfoot: Ember.computed.readOnly('table.tfoot'),

  rows: construct(Ember.A).readOnly(),

  rowsChange: observerOnceIn('afterRender', 'rows.[]', 'tfoot.rows.[]', function() {
    this.get('table').measure();
  }),

  scroller: Ember.computed(function() {
    let scrollers = this.$('.ui-scrollable__scroller');
    let [ froze, unfroze ] = scrollers;

    return {
      all: scrollers,
      froze: Ember.$(froze),
      unfroze: Ember.$(unfroze)
    };
  }).readOnly(),

  scrollable: Ember.computed(function() {
    let scrollables = this.$('.ui-scrollable');
    let [ froze, unfroze ] = scrollables;

    return {
      all: scrollables,
      froze: Ember.$(froze),
      unfroze: Ember.$(unfroze)
    };
  }).readOnly(),

  willInsertElement() {
    this._super(...arguments);

    let rows = this.get('rows');

    this.$().on('register.tr', (evt, tr) => {
      let scroller = this.get('scroller.unfroze');
      let index = scroller.children().index(tr.$());

      tr.set('itemIndex', index);

      rows.pushObject(tr);
    });
  },

  didInsertElement() {
    this._super(...arguments);

    this.$().parent().trigger('register.tbody', this)
    this.$().parent().trigger('register.all', this);

    let ns = this.get('table.elementId');

    let oldOrder = this.get('table.thead.childHeaderLeafList').map(leaf => leaf.element);

    this.get('table').$().on(`sortupdate.${ns}`, evt => {
      let rows = this.get('rows').concat(this.get('tfoot.rows') || []);
      let ops = []; // TODO there should be an algorithm where only 1 op is needed

      let newOrder = this.get('table.thead').$('.ui-table__th')
        .filter((index, element) => !Ember.$(element).find('.ui-table__th').length);

      for (let index = 0, len = newOrder.length; index < len; index++) {
        if (oldOrder[index] !== newOrder[index]) {
          let newIndex = index;
          let oldIndex = oldOrder.indexOf(newOrder[index]);

          oldOrder.splice(index, 0, ...oldOrder.splice(oldIndex, 1));

          ops.push({ oldIndex, newIndex });
        }
      }

      rows.forEach(tr => {
        let cells = tr.get('childCellList');

        ops.forEach(({ oldIndex, newIndex }) => {
          let oldNode = cells.objectAt(oldIndex).$();
          let newNode = cells.objectAt(newIndex).$();

          oldNode.insertBefore(newNode);

          cells.splice(newIndex, 0, ...cells.splice(oldIndex, 1));
        })
      });

      // TODO sort mirror cells too
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    let ns = this.get('elementId');

    this.get('table').$().off(`sortupdate.${ns}`);
    this.$().parent().trigger('unregister.tbody', this)
    this.$().off('register.tr');
  },

  freezeColumns: Ember.on('init', observerOnceIn('afterRender', 'thead.childHeaderList.@each.frozen', 'rows.[]', function() {
    let leaves = this.get('thead.childHeaderLeafList');
    let [ froze, unfroze ] = this.get('thead.childHeaderList').reduce(([ froze, unfroze ], th) => {
      (th.get('frozen') ? froze : unfroze).push(th);

      return [ froze, unfroze ];
    }, [ [], [] ]);

    froze.forEach(th => th.freeze());
    unfroze.forEach(th => th.unfreeze());

    [ [ this.get('scroller.froze'), this.get('rows') ], [ this.get('table.tfoot.froze'), this.get('table.tfoot.rows') || [] ] ]
      .forEach(([ scroller, rows ]) => {
        rows.forEach(tr => {
          let mirror = tr.get('frozenMirrorRow');
          let cells = tr.get('childCellList');

          if (mirror.parent().is('.ui-table__tr')) {
            let { TEXT_NODE, ELEMENT_NODE } = document;

            cells.forEach((cell, index) => {
              cell.set('th', leaves.objectAt(index));
              cell.get('frozenMirrorCell').appendTo(mirror);
            });

            (function recur(nodes) {
              nodes.each((index, node) => {
                switch (node.nodeType) {
                  case TEXT_NODE: node.data = node.data.trim(); return;
                  case ELEMENT_NODE: recur(Ember.$(node).contents()); return;
                }
              });
            })(tr.$().contents());

            scroller.append(mirror);
          }

          cells.forEach(cell => {
            if (cell.get('th.frozen')) {
              cell.freeze();
            }
            else {
              cell.unfreeze();
            }
          });
        });
      });
  }))
});
