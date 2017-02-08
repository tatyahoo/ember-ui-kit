import Ember from 'ember';
import layout from '../../templates/components/ui-table/tfoot';

import { construct } from '../../utils/computed';

export default Ember.Component.extend({
  classNames: 'ui-table__tfoot',
  layout,

  // attrs {
  table: null,
  // attrs }

  rows: construct(Ember.A).readOnly(),

  froze: Ember.computed(function() {
    return this.$().children('.ui-table__froze');
  }).readOnly(),

  scroller: Ember.computed(function() {
    return this.$('.ui-scrollable__scroller');
  }).readOnly(),

  willInsertElement() {
    this._super(...arguments);

    let rows = this.get('rows');

    this.$().on('register.tr', (evt, tr) => {
      let index = this.get('scroller').children().index(tr.$());

      tr.set('itemIndex', index);

      rows.pushObject(tr);
    });
  },

  didInsertElement() {
    this._super(...arguments);

    this.$().parent().trigger('register.tfoot', this);
    this.$().parent().trigger('register.all', this);

    this.$().contents().each(function(index, node) {
      if (node.nodeType === document.TEXT_NODE) {
        node.data = node.data.trim();
      }
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().parent().trigger('unregister.tfoot', this);
    this.$().off('register.tr');
  },
});
