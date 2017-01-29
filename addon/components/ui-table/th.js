import Ember from 'ember';
import layout from '../../templates/components/ui-table/th';

import Pluggable from '../../mixins/pluggable';

import { swapNodes } from '../../utils/dom';

export default Ember.Component.extend(Pluggable, {
  classNames: 'ui-table__th',
  classNameBindings: 'columnClass',
  layout,

  // attrs {
  width: null,
  span: 1,
  frozen: false,

  // @private
  table: null,
  // @private
  thead: null,
  // @private
  th: null,
  // attrs }

  columnClass: Ember.computed.readOnly('elementId'),
  columnIndex: Ember.computed('thead.childHeaderLeafList.[]', function() {
    return this.get('thead.childHeaderLeafList').indexOf(this) + 1;
  }).readOnly(),
  columnWidth: Ember.computed('width', 'span', 'thead.{availableComputableSpan,availableComputableWidth}', function() {
    let width = this.get('width');

    if (typeof width === 'number') {
      return width;
    }

    let availableComputableWidth = this.get('thead.availableComputableWidth');

    if (typeof width === 'string' && width.match(/[\d\.]+\%$/)) {
      let pc = parseFloat(width);

      return availableComputableWidth * pc / 100;
    }

    let availableComputableSpan = this.get('thead.availableComputableSpan');

    let span = this.get('span');

    return availableComputableWidth * span / availableComputableSpan;
  }).readOnly(),

  childHeaderList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  isLeafHeader: Ember.computed.empty('childHeaderList'),

  frozenMirrorCellNode: Ember.computed(function() {
    return document.createComment(`frozen-mirror-${this.get('elementId')}`);
  }).readOnly(),

  frozenMirrorCell: Ember.computed('frozenMirrorCellNode', function() {
    return Ember.$(this.get('frozenMirrorCellNode'));
  }).readOnly(),

  freeze() {
    let isLeaf = this.get('isLeafHeader');

    if (!isLeaf) {
      return;
    }

    let mirror = this.get('frozenMirrorCell');

    Ember.run.schedule('afterRender', this, function() {
      if (mirror.parent().is('.ui-table__thead__scroller--froze')) {
        swapNodes(this.element, mirror);
      }
    });
  },

  unfreeze() {
    let isLeaf = this.get('isLeafHeader');

    if (!isLeaf) {
      return;
    }

    let mirror = this.get('frozenMirrorCell');

    Ember.run.schedule('afterRender', this, function() {
      if (!mirror.parent().is('.ui-table__thead__scroller--froze')) {
        swapNodes(this.element, mirror);
      }
    });
  },

  plugins: {
    register: {
      render() {
        let headers = this.get('childHeaderList');

        this.$().on('register.th', '.ui-table__th', (evt, th) => {
          Ember.run.join(headers, headers.pushObject, th);

          return false;
        });
      },

      afterRender() {
        this.$().trigger('register.th', this);
      },

      destroy() {
        this.$().off('register.th');
        this.$().trigger('unregister.th', this);
      }
    },

    resizable: {
      render() {
        this.$().on('resize', Ember.run.bind(this, function(evt, ui) {
          this.set('width', ui.size.width);
        }));
      },

      destroy() {
        this.$().off('resize');
      }
    },

    freezable: {
      destroy() {
        this.unfreeze();
      }
    }
  }
});
