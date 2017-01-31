import Ember from 'ember';
import layout from '../templates/components/ui-table';

import Pluggable from '../mixins/pluggable';
import ResizeAware from '../mixins/resize-aware';
import Measurable from '../mixins/measurable';

import { task, timeout } from 'ember-concurrency';

import { debounce } from '../utils/raf';

export default Ember.Component.extend(Pluggable, ResizeAware, Measurable, {
  classNames: 'ui-table',
  layout,

  thead: null,
  tbody: null,
  tfoot: null,

  scrollables: Ember.computed(function() {
    return this.$('.ui-table__scrollable')
      .not('.ui-table__thead__scrollable.ui-table__froze')
      .not('.ui-table__tfoot__scrollable.ui-table__froze');
  }).readOnly(),

  scrollTarget: null,
  scrollTop: 0,
  scrollLeft: 0,
  scrollSync: task(function *() {
    let id;
    let context = this;

    id = requestAnimationFrame(function update() {
      context.scrollUpdate();

      id = requestAnimationFrame(update);
    });

    try {
      yield timeout(150);

      cancelAnimationFrame(id);

      context.scrollUpdate();
    }
    finally {
      cancelAnimationFrame(id);
    }
  }).drop(),
  scrollUpdate() {
    let scrollables = this.get('scrollables');

    scrollables.add().not(this.get('scrollTarget'))
      .scrollTop(this.get('scrollTop'))
      .scrollLeft(this.get('scrollLeft'));
  },

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
      render() {
      },

      afterRender() {
        let scrollables = this.get('scrollables');
        let sync = this.get('scrollSync');

        let vertical = scrollables.add()
          .filter('.ui-table__tbody__scrollable');

        let horizontal = scrollables.add()
          .filter('.ui-table__unfroze');

        // The point here is to desynchronize upstream and downstream
        // upstream is where scroll event updates scroll position
        // downstream is where another "thread" updates scroll position

        vertical.on('scroll', Ember.run.bind(this, function(evt) {
          this.setProperties({
            scrollTarget: evt.currentTarget,
            scrollTop: evt.currentTarget.scrollTop
          });

          sync.perform();
        }));

        horizontal.on('scroll', Ember.run.bind(this, function(evt) {
          this.setProperties({
            scrollTarget: evt.currentTarget,
            scrollLeft: evt.currentTarget.scrollLeft
          });

          sync.perform();
        }));
      },

      destroy() {
        this.$('.ui-table__scrollable').off('scroll');
      }
    },

  }
});
