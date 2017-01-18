import Ember from 'ember';
import layout from '../templates/components/ui-table';

import Pluggable from '../mixins/pluggable';
import ResizeAware from '../mixins/resize-aware';

export default Ember.Component.extend(Pluggable, ResizeAware, {
  classNames: 'ui-table',
  layout,

  defaultEmptyComponent: Ember.computed(function() {
    return {
      $() {
        return Ember.$();
      }
    };
  }).readOnly(),

  thead: Ember.computed.oneWay('defaultEmptyComponent'),
  tbody: Ember.computed.oneWay('defaultEmptyComponent'),
  tfoot: Ember.computed.oneWay('defaultEmptyComponent'),

  availableWidth: null,

  resize() {
    let parts = [ 'thead', 'tbody', 'tfoot' ];
    let components = {
      thead: this.get('thead'),
      tbody: this.get('tbody'),
      tfoot: this.get('tfoot')
    };
    let elements = {
      table: this.$(),
      thead: components.thead.$(),
      tbody: components.tbody.$(),
      tfoot: components.tfoot.$()
    };
    let height = {
      thead: elements.thead.height() || 0,
      tbody: elements.tbody.height() || 0,
      tfoot: elements.tfoot.height() || 0
    };

    this.set('availableWidth', this.$().width());

    elements.table.height(parts.reduce((accum, part) => {
      return accum + (elements[part].prop('scrollHeight') || 0);
    }, 0));

    elements.tbody.css({
      marginTop: height.thead,
      marginBottom: height.tfoot,
      height: this.$().height() - (elements.thead.height() || 0) - (elements.tfoot.height() || 0)
    });
  },

  plugins: {
    register: {
      render() {
        this.$().on('register.thead register.tbody register.tfoot', (evt, component) => {
          Ember.run.join(this, this.set, evt.namespace, component);
        });
      },

      destroy() {
        this.$().off('register.thead register.tbody register.tfoot');
      }
    }
  }
});
