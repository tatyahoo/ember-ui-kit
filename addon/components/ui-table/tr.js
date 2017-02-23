import Ember from 'ember';
import layout from '../../templates/components/ui-table/tr';

import Composable from '../../mixins/composable';

import { construct } from '../../utils/computed';

/**
 * @private
 * @module ui
 * @class ui-table.tr
 */
export default Ember.Component.extend(Composable, {
  componentRegistrationName: 'tr',

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
      evt.stopPropagation();

      childCellList.pushObject(td);
    });

    this.$().on('unregister.td', (evt, td) => {
      evt.stopPropagation();

      childCellList.removeObject(td);
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    this.get('frozenMirrorRow').remove();

    this.$().off('register.th');
  }
});
