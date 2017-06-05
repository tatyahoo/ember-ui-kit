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
    return this.$('[data-column-children="0"]').toArray().map(Ember.$);
  }).readOnly(),

  leafNodeWidths: Ember.computed('leafNodes', function() {
    return this.get('leafNodes').map(el => el.attr('data-column-width'));
  }).readOnly(),

  ns: Ember.computed(function() {
    return this.$().closest('.ui-table--v2').attr('id');
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);

    detector.listenTo(this.$('.ui-thead__resizer').get(0), this.rerender = Ember.run.bind(this, this.rerender));
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
  }
});
