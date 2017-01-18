import Ember from 'ember';
import layout from '../templates/components/ui-table';

import Pluggable from '../mixins/pluggable';
import ResizeAware from '../mixins/resize-aware';
import Measurable from '../mixins/measurable';

export default Ember.Component.extend(Pluggable, ResizeAware, Measurable, {
  classNames: 'ui-table',
  layout,

  thead: null,
  tbody: null,
  tfoot: null,

  resize() {
    let sizables = [ this, this.get('thead'), this.get('tbody'), this.get('tfoot') ];

    Ember.run.schedule('render', this, function() {
      sizables.forEach(component => {
        Ember.tryInvoke(component, 'measure');
      });
    });
    Ember.run.schedule('afterRender', this, function() {
      let components = sizables.slice(1);

      components.forEach(component => {
        Ember.tryInvoke(component, 'resize');
      });

      this.$().height(components.reduce((accum, component) => {
        return accum + (Ember.get(component || {}, 'measurements.scrollHeight') || 0);
      }, 0));
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
