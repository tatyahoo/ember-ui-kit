import Ember from 'ember';

import crossfilter from 'crossfilter';

import Dimension from './dimension-model';
import Group from './group-model';

export default Ember.ObjectProxy.extend({
  accessor: null,

  raw: Ember.computed('accessor', {
    get() {
      return crossfilter([]);
    },

    set(key, data) {
      let accessor = this.get('accessor')

      if (accessor) {
        return crossfilter(accessor(data));
      }

      // native array
      if (Array.isArray(data)) {
        return crossfilter(data);
      }
      // ember array
      if (Ember.isArray(data)) {
        return crossfilter(data.toArray());
      }

      Ember.assert('crossfilter#raw was passed in unusable data');
    }
  }),

  size: Ember.computed('raw', function() {
    return this.get('raw').size();
  }).readOnly(),

  groups: Ember.computed({
    get() {
      Ember.assert('crossfilter#dimensions get is not implemented');
    },

    set(key, configurations) {
      return Group.attachTo(configurations, {
        parent: this,
        host: this.get('content'),
        crossfilter: this,
        dimension: null
      });
    }
  }),

  dimensions: Ember.computed({
    get() {
      Ember.assert('crossfilter#dimensions get is not implemented');
    },

    set(key, configurations) {
      let dimensions = configurations.map(({ name, accessor, groups, filter }) => {
        return Dimension
          .extend({
            filter: filter && filter.accessor
          })
          .create({
            content: this.get('content'),
            name,
            accessor,
            groups,
            parent: this
          });
      });
      let bindable = Ember.ArrayProxy.create({
        content: dimensions
      });

      dimensions.forEach(dimension => {
        let name = dimension.get('name');

        bindable.set(name, dimension);

        this.set(name, dimension);
      });

      return bindable;
    }
  }),

  destroy() {
    this._super(...arguments);

    this.get('dimensions').forEach(dimension => {
      dimension.destroy();
    });
  },

  toStringExtension() {
    return 'crossfilter';
  }
});
