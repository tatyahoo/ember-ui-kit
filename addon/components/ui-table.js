import Ember from 'ember';
import layout from '../templates/components/ui-table';

import Pluggable from '../mixins/pluggable';
import ResizeAware from '../mixins/resize-aware';
import Measurable from '../mixins/measurable';

import { throttle } from '../utils/raf';

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
    },

    scroll: {
      afterRender() {
        let active = null;
        let scrollable = this.$('.ui-table__scrollable')
          .not('.ui-table__thead__scrollable.ui-table__froze')
          .not('.ui-table__tfoot__scrollable.ui-table__froze')

        let vertical = scrollable.add()
          .filter('.ui-table__tbody__scrollable');

        let horizontal = scrollable.add()
          .filter('.ui-table__unfroze');

        scrollable.on('scroll', throttle(evt => {
          let target = evt.currentTarget;
          let left = target.scrollLeft;
          let top = target.scrollTop;

          vertical.add().not(target).each(function() {
            this.scrollTop = top;
          });

          horizontal.add().not(target).each(function() {
            this.scrollLeft = left;
          });
        }));
      }
    },

  }
});
