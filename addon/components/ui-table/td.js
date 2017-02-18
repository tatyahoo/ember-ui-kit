import Ember from 'ember';
import layout from '../../templates/components/ui-table/td';

import { swapNodes } from '../../utils/dom';

/**
 * @module component
 * @class ui-table.td
 * @private
 */
export default Ember.Component.extend({
  classNames: 'ui-table__td',
  classNameBindings: 'columnClass',
  layout,

  // attrs {
  // @private
  table: null,
  // @private
  tbody: null,
  // @private
  tr: null,
  // @private
  th: null,
  // attrs }

  columnClass: Ember.computed.readOnly('th.columnClass'),

  frozenMirrorCellNode: Ember.computed(function() {
    return document.createComment(`frozen-mirror-${this.get('elementId')}`);
  }).readOnly(),

  frozenMirrorCell: Ember.computed('frozenMirrorCellNode', function() {
    return Ember.$(this.get('frozenMirrorCellNode'));
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);

    this.$().parent().trigger('register.td', this);
    this.$().parent().trigger('register.all', this);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.unfreeze();
    this.get('frozenMirrorCell').remove();

    this.$().parent().trigger('unregister.td', this);
    this.$().off('register.th');
  },

  freeze() {
    let th = this.get('th');

    if (th) {
      let mirror = this.get('frozenMirrorCell');

      if (mirror.parent().is('.ui-table__tr--froze')) {
        swapNodes(this.element, mirror);
      }
    }
  },

  unfreeze() {
    let th = this.get('th');

    if (th) {
      let mirror = this.get('frozenMirrorCell');

      if (!mirror.parent().is('.ui-table__tr--froze')) {
        swapNodes(this.element, mirror);
      }
    }
  }
});
