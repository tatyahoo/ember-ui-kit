import Ember from 'ember';
import layout from '../templates/components/ui-thead';

import Styleable from '../mixins/styleable';

import { layout as cssLayout } from '../utils/dom';

/* global elementResizeDetectorMaker */
let detector = elementResizeDetectorMaker({
  strategy: 'scroll'
});

export default Ember.Component.extend(Styleable, {
  classNames: 'ui-thead',
  layout,

  /**
   * @attribute {} breakpoints
   */
  breakpoints: null,

  leafNodes: Ember.computed(function() {
    return this.$('[data-column-children="0"]');
  }).readOnly(),

  leafNodeWidths: Ember.computed('leafNodes', function() {
    return this.get('leafNodes')
      .toArray()
      .map(el => Ember.$(el).attr('data-column-width'));
  }).readOnly(),

  ns: Ember.computed(function() {
    return this.$().closest('.ui-table--v2').attr('id');
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);

    let leaves = this.get('leafNodes');
    let table = this.$().closest('.ui-table--v2');

    detector.listenTo(this.$('.ui-thead__resizer').get(0), this.rerender = Ember.run.bind(this, this.rerender));

    this.$('.ui-sortable').on('sortupdate', (evt, { item }) => {
      let target = item.attr('data-column-id');
      let after = item.next().attr('data-column-id');

      // `target` is moved to before `after`

      table.find('.ui-tr').each(function() {
        let tr = Ember.$(this);

        if (typeof after !== 'undefined') {
          let before = tr.find(`[data-column-id="${after}"]`);

          tr.find(`[data-column-id="${target}"]`).insertBefore(before);
        }
        else {
          tr.find(`[data-column-id="${target}"]`).appendTo(tr);
        }
      });
    });
    this.$().on('resize', Ember.run.bind(this, function() {
      this.notifyPropertyChange('leafNodeWidths');
      this.rerender();
    }));
  },

  didRender() {
    this._super(...arguments);

    let ns = this.get('ns');
    let widths = this.get('leafNodeWidths');

    // TODO handle breakpoints
    cssLayout(this.$().width(), widths).forEach((width, index) => {
      this.style(`#${ns} [data-column-id="${index}"]`, {
        width: `${width}px`
      });
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    detector.removeListener(this.$('.ui-thead__resizer').get(0), this.rerender);

    this.$().off();
  }
});
