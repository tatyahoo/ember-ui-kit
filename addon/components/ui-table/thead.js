import Ember from 'ember';
import layout from '../../templates/components/ui-table/thead';

import Composable from '../../mixins/composable';
import Styleable from '../../mixins/styleable';

import { getBox } from '../../utils/dom';
import { construct } from '../../utils/computed';

/**
 * Advanced Usage:
 *
 * ```handlebars
 * {{#ui-table as |t|}}
 *   {{#t.head as |t|}}
 *     {{#t.h}}
 *       <div>Nested Headers</div>
 *       {{#t.h width=90}}Nesting{{/t.h}}
 *       {{#t.h width=90}}Nesting{{/t.h}}
 *     {{/t.h}}
 *     {{#ui-sortable}}
 *       {{#t.h width=90}}Sortable{{/t.h}}
 *       {{#t.h width=90}}Column{{/t.h}}
 *       {{#t.h width=90}}That{{/t.h}}
 *       {{#t.h width=90}}Allows{{/t.h}}
 *       {{#t.h width=90}}
 *         {{#ui-resizable}}
 *           Resizing
 *         {{/ui-resizable}}
 *       {{/t.h}}
 *     {{/ui-sortable}}
 *   {{/t.head}}
 * {{/ui-table}}
 * ```
 *
 * @private
 * @module ui
 * @class ui-table.thead
 */
export default Ember.Component.extend(Composable, Styleable, {
  componentRegistrationName: 'thead',
  classNames: 'ui-table__thead',
  layout,

  // attrs {
  table: null,
  // attrs }

  childHeaderList: construct(Ember.A).readOnly(),
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

  boxes: Ember.computed(function() {
    let corner = this.$('.ui-table__froze');
    let scroller = this.$('.ui-scrollable__scroller');

    return scroller
      .parentsUntil('.ui-table__thead')
      .addBack()
      .add(corner)
      .toArray();
  }).readOnly(),

  willInsertElement() {
    this._super(...arguments);

    let childHeaderList = this.get('childHeaderList');
    let thead = this.$();

    thead.on('register.th', (evt, th) => {
      childHeaderList.pushObject(th);

      th.get('frozenMirrorCell').appendTo(thead.children('.ui-table__froze'));
    });
  },

  didInsertElement() {
    this._super(...arguments);

    let { TEXT_NODE, ELEMENT_NODE } = document;

    (function recur(nodes) {
      nodes.each((index, node) => {
        switch (node.nodeType) {
          case TEXT_NODE: node.data = node.data.trim(); return;
          case ELEMENT_NODE: recur(Ember.$(node).contents()); return;
        }
      });
    })(this.$().contents());
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().off('register.th');
  },

  resizeWidth() {
    let box = getBox(this.element);
    let frozeBox = getBox(this.$().children('.ui-table__froze').get(0));
    //let unfrozeBox = getBox(this.$().children('.ui-table__unfroze').get(0));
    let leaves = this.get('childHeaderLeafList');
    let availableSpan = leaves.reduce((accum, th) => {
      let width = th.get('width');

      if (typeof width === 'number') {
        return accum;
      }

      return accum + th.get('span');
    }, 0);
    let availableWidth = box.width;

    availableWidth -= box.padding.left + box.padding.right;
    availableWidth -= box.border.left + box.border.right;

    availableWidth -= this.get('boxes').map(getBox).reduce((accum, box) => {
      accum += box.padding.left + box.padding.right;
      accum += box.border.left + box.border.right;

      return accum;
    }, 0);

    availableWidth -= leaves.reduce((accum, th) => {
      let width = th.get('width');

      if (typeof width === 'number') {
        return accum + width;
      }

      return accum;
    }, 0);

    leaves.forEach(th => {
      let width = th.get('width');

      if (typeof width === 'number') {
        return th.set('columnWidth', width);
      }

      if (typeof width === 'string' && width.match(/[\d\.]+\%$/)) {
        return th.set('columnWidth', availableWidth * parseFloat(width) / 100);
      }

      return th.set('columnWidth', availableWidth * th.get('span') / availableSpan);
    });

    let ns = this.get('table.elementId');
    let froze = leaves.filterBy('frozen', true).reduce((accum, th) => accum + th.get('columnWidth'), 0);
    let unfroze = leaves.filterBy('frozen', false).reduce((accum, th) => accum + th.get('columnWidth'), 0);

    this.$('.ui-table__th--branch').each(function(index, element) {
      let branch = Ember.$(element);
      let leaves = branch.find('.ui-table__th--leaf');

      branch.css({
        width: leaves.toArray().reduce((accum, leaf) => {
          return accum + Ember.$(leaf).data('$E').get('columnWidth');
        }, 0)
      });
    });

    this.style(`#${ns} .ui-table__froze`, {
      width: `${froze + frozeBox.padding.left + frozeBox.padding.right}px`
    });
    this.style(`#${ns} .ui-table__unfroze`, {
      width: `${box.width - box.padding.left - box.padding.right - box.border.left - box.border.right - froze - frozeBox.padding.left - frozeBox.padding.right - frozeBox.border.left - frozeBox.border.right}px`
    });
    this.style(`#${ns} .ui-table__unfroze .ui-scrollable__scroller`, {
      width: `${unfroze}px`
    });
  }
});
