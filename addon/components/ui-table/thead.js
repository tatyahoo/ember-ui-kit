import Ember from 'ember';
import layout from '../../templates/components/ui-table/thead';

import Pluggable from '../../mixins/pluggable';
import ResizeAware from '../../mixins/resize-aware';

export default Ember.Component.extend(Pluggable, ResizeAware, {
  classNames: 'ui-table__thead',
  layout,

  // attrs {
  table: null,
  // attrs }

  childHeaderList: Ember.computed(function() {
    return Ember.A();
  }).readOnly(),

  availableSpan: Ember.computed('childHeaderList.@each.span', function() {
    return this.get('childHeaderList').reduce((accum, header) => {
      return accum + header.get('span');
    }, 0);
  }).readOnly(),
  availableWidth: Ember.computed('childHeaderList.@each.width', function() {
    return this.$().width() - this.get('childHeaderList').reduce((accum, header) => {
      return accum + header.get('width');
    }, 0);
  }).readOnly(),

  resize() {
    this.notifyPropertyChange('availableWidth');
  },

  plugins: {
    register: {
      render() {
        let childHeaderList = this.get('childHeaderList');

        this.$().on('register.th', (evt, th) => {
          childHeaderList.pushObject(th);
        });

        this.$().on('unregister.th', (evt, th) => {
          childHeaderList.removeObject(th);
        });
      },

      afterRender() {
        this.$().trigger('register.thead', this);
      },

      destroy() {
        this.$().off();
      }
    },

    textNodes: {
      afterRender() {
        let { TEXT_NODE, ELEMENT_NODE } = document;

        (function recur(nodes) {
          nodes.each((index, node) => {
            switch (node.nodeType) {
              case TEXT_NODE: node.data = node.data.trim(); return;
              case ELEMENT_NODE: recur(Ember.$(node).contents()); return;
            }
          });
        })(this.$().contents());
      }
    }
  }
});
