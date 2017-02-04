import Ember from 'ember';
import layout from '../../templates/components/ui-table/thead';

import Styleable from '../../mixins/styleable';

import { styleable, getBox } from '../../utils/dom';
import { construct } from '../../utils/computed';

export default Ember.Component.extend(Styleable, {
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

    this.$().parent().trigger('register.thead', this)
    this.$().parent().trigger('register.all', this);

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

    this.$().parent().trigger('unregister.thead', this)
    this.$().off('register.th');
  },

  resizeWidth() {
    let box = getBox(this.element);
    let frozeBox = getBox(this.$().children('.ui-table__froze').get(0));
    let unfrozeBox = getBox(this.$().children('.ui-table__unfroze').get(0));
    let leaves = this.get('childHeaderLeafList');
    let css = getComputedStyle(this.element);
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

    availableWidth -= frozeBox.padding.left + frozeBox.padding.right;
    availableWidth -= frozeBox.margin.left + frozeBox.margin.right;
    availableWidth -= frozeBox.border.left + frozeBox.border.right;

    availableWidth -= unfrozeBox.padding.left + unfrozeBox.padding.right;
    availableWidth -= unfrozeBox.margin.left + unfrozeBox.margin.right;
    availableWidth -= unfrozeBox.border.left + unfrozeBox.border.right;

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
      left: `${box.padding.left}px`,
      width: `${froze + frozeBox.padding.left + frozeBox.padding.right}px`
    });
    this.style(`#${ns} .ui-table__unfroze`, {
      left: `${froze + box.padding.left + frozeBox.padding.left + frozeBox.padding.right + frozeBox.border.left + frozeBox.border.right}px`,
      width: `${box.width - box.padding.left - box.padding.right - box.border.left - box.border.right - froze - frozeBox.padding.left - frozeBox.padding.right - frozeBox.border.left - frozeBox.border.right}px`
    });
    this.style(`#${ns} .ui-table__unfroze .ui-scrollable__scroller`, {
      width: `${unfroze}px`
    });
  }
});
