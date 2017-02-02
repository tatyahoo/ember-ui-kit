import Ember from 'ember';

import _ from 'lodash';

import Group from './group-model';

import { filterAppliedProperty } from './computed';

function getter(path) {
  return function(item) {
    return Ember.get(item, path);
  };
}

export default Ember.ObjectProxy.extend({
  parent: null,
  crossfilter: Ember.computed.alias('parent'),

  name: null,
  accessor: Ember.computed('name', {
    get() {
      Ember.assert('dimension#accessor get is not implemented');
    },
    set(key, accessor) {
      switch (typeof accessor) {
        case 'function': return accessor;
        case 'string': return getter(accessor);
        case 'undefined': return getter(this.get('name'));
      }

      if (typeof accessor === 'object') {
        if (Array.isArray(accessor)) {
          return function(item) {
            return accessor.map(path => {
              return Ember.get(item, path);
            });
          };
        }
        else {
          return function(item) {
            return _.mapValues(accessor, path => {
              return Ember.get(item, path);
            });
          };
        }
      }

      Ember.assert(`Unable to process accessor ${accessor}`);
    }
  }),
  filter: null,

  raw: Ember.computed('parent', 'accessor', function() {
    return this.get('parent.raw').dimension(this.get('accessor'));
  }).readOnly(),

  normalized: Ember.computed('raw', 'filter', function() {
    let filter = this.get('filter');
    let dimension = this.get('raw');

    if (Ember.isEmpty(filter)) {
      dimension.filterAll();
    }
    else {
      dimension.filter(filter);
    }

    return dimension;
  }).readOnly(),

  groups: Ember.computed({
    get() {
      Ember.assert('dimension#groups get is not implemented');
    },

    set(key, configurations) {
      return Group.attachTo(configurations, {
        parent: this,
        host: this.get('content')
      });
    }
  }),

  // Hint: Use {{compute}} to grab the result
  top: filterAppliedProperty(function(dimension) {
    return k => {
      return dimension.top(typeof k === 'undefined' ? Infinity : Number(k));
    };
  }),

  // Hint: Use {{compute}} to grab the result
  bottom: filterAppliedProperty(function(dimension) {
    return k => {
      return dimension.bottom(typeof k === 'undefined' ? Infinity : Number(k));
    };
  }),

  destroy() {
    this._super(...arguments);

    this.get('groups').forEach(group => {
      group.destroy();
    });

    this.get('normalized').dispose();
  },

  toStringExtension() {
    return 'dimension';
  }
});
