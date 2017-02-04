import Ember from 'ember';
import layout from '../../templates/components/ui-table/tr';

import Pluggable from '../../mixins/pluggable';

import { observerOnce } from '../../utils/run';
import { construct } from '../../utils/computed';

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

  frozenMirrorRow: Ember.computed(function() {
    return this.$('.ui-table__tr--froze');
  }).readOnly(),

  childCellList: construct(Ember.A).readOnly(),

  odd: Ember.computed('itemIndex', function() {
    let index = this.get('itemIndex');

    if (typeof index === 'number') {
      return index % 2;
    }

    return null;
  }).readOnly(),

  even: Ember.computed('itemIndex', function() {
    let index = this.get('itemIndex');

    if (typeof index === 'number') {
      return (index + 1) % 2;
    }

    return null;
  }).readOnly(),

  willInsertElement() {
    this._super(...arguments);

    let childCellList = this.get('childCellList');

    this.$().on('register.td', (evt, td) => {
      childCellList.pushObject(td);
    });
  },

  didInsertElement() {
    this._super(...arguments);

    this.$().parent().trigger('register.tr', this)
    this.$().parent().trigger('register.all', this);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.get('frozenMirrorRow').remove();

    this.$().parent().trigger('unregister.tr', this)
    this.$().parent().trigger('unregister.all', this)
    this.$().off('register.th');
  }
});
