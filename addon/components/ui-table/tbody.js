import Ember from 'ember';
import layout from '../../templates/components/ui-table/tbody';

import { observerOnceIn } from '../../utils/run';
import { construct } from '../../utils/computed';
import { setMicrostateNumber } from '../../utils/microstate';

/**
 * Advanced Usage:
 *
 * ```handlebars
 * {{#ui-table as |t|}}
 *   {{#t.body as |t|}}
 *    {{! (Select) from ember-microstates }}
 *    {{#each (Select users) as |user|}}
 *      {{#t.r click=(action user.toggle) as |t|}}
 *        {{#t.d}}{{user.id}}{{/t.d}}
 *        {{#t.d}}{{user.name}}{{/t.d}}
 *        {{#t.d}}{{user.address}}{{/t.d}}
 *      {{/t.r}}
 *    {{/each}}
 *   {{/t.body}}
 * {{/ui-table}}
 * ```
 *
 * See also [tbody-each](./ui-table.tbody-each.html)
 *
 * @module component
 * @class ui-table.tbody
 * @private
 */
export default Ember.Component.extend({
  classNames: 'ui-table__tbody',
  layout,

  // attrs {
  cursor: 0, // TODO cursor is write only, need to implement read
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
    let scrollables = this.$('.ui-scrollable__viewport');
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

    this.$().on('ps-scroll-y', () => {
      let unfroze = this.get('scrollable.unfroze').get(0).getBoundingClientRect();
      let component = Ember.$(document.elementFromPoint(unfroze.left + 0.5, unfroze.top + 0.5))
        .closest('.ui-table__tr')
        .data('$E');

      if (component) {
        setMicrostateNumber(this, 'cursor', component.get('itemIndex'));
      }
    });
  },

  didInsertElement() {
    this._super(...arguments);

    this.$().parent().trigger('register.tbody', this);
    this.$().parent().trigger('register.all', this);

    let ns = this.get('table.elementId');

    let oldOrder = this.get('table.thead.childHeaderLeafList').map(leaf => leaf.element);

    this.$().parents('.ui-table:first').on(`sortupdate.${ns}`, () => {
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
        });
      });

      // TODO sort mirror cells too
    });

    this.$().contents().each(function(index, node) {
      if (node.nodeType === document.TEXT_NODE) {
        node.data = node.data.trim();
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    let ns = this.get('elementId');

    this.$().parents('.ui-table:first').off(`sortupdate.${ns}`);
    this.$().parent().trigger('unregister.tbody', this);
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
            let { TEXT_NODE } = document;

            cells.forEach((cell, index) => {
              cell.set('th', leaves.objectAt(index));
              cell.get('frozenMirrorCell').appendTo(mirror);
            });

            (function recur(nodes) {
              nodes.each((index, node) => {
                if (node.nodeType === TEXT_NODE) {
                  return node.data = node.data.trim();
                }
                else if (!Ember.$(node).is('.ui-table__td')) {
                  return recur(Ember.$(node).contents());
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

    this.get('thead').resizeWidth();
  }))
});
