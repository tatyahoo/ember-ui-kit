import Ember from 'ember';
import layout from '../../templates/components/ui-table/td';

import Pluggable from '../../mixins/pluggable';

import { swapNodes } from '../../utils/dom';

export default Ember.Component.extend(Pluggable, {
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

  freeze() {
    let mirror = this.get('frozenMirrorCell');

    Ember.run.schedule('afterRender', this, function() {
      if (mirror.parent().is('.ui-table__tr--froze')) {
        swapNodes(this.element, mirror);
      }
    });
  },

  unfreeze() {
    let mirror = this.get('frozenMirrorCell');

    Ember.run.schedule('afterRender', this, function() {
      if (!mirror.parent().is('.ui-table__tr--froze')) {
        swapNodes(this.element, mirror);
      }
    });
  },

  plugins: {
    register: {
      afterRender() {
        this.$().trigger('register.td', this);
      },

      destroy() {
        this.$().trigger('unregister.td', this);
      }
    },

    freezable: {
      destroy() {
        this.unfreeze();
      }
    }
  }
});
