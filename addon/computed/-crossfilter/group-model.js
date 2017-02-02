import Ember from 'ember';

import Crossfilter from './crossfilter-model';
import Dimension from './dimension-model';

import { filterAppliedProperty } from './computed';

function wrapGroupObject(obj) {
  return obj.wrapper || (obj.wrapper = Object.create(obj));
}

export default Ember.ObjectProxy.extend({
  parent: null,
  dimension: Ember.computed('parent', function() {
    let parent = this.get('parent');

    if (parent instanceof Dimension) {
      return parent;
    }
    if (parent instanceof Crossfilter) {
      return null;
    }

    Ember.assert('crossfilter group cannot find dimension');
  }).readOnly(),
  crossfilter: Ember.computed('parent', function() {
    let parent = this.get('parent');

    if (parent instanceof Dimension) {
      return parent.get('crossfilter');
    }
    if (parent instanceof Crossfilter) {
      return parent;
    }

    Ember.assert('crossfilter group cannot find crossfilter');
  }).readOnly(),

  name: null,
  accessor: null,
  reduce: null,

  raw: Ember.computed('parent', 'accessor', function() {
    let dimension = this.get('parent.raw');
    let accessor = this.get('accessor');

    return (
      accessor === 'all' ? dimension.groupAll() :
      typeof accessor === 'undefined' ?  dimension.group() :
      dimension.group(accessor)
    );
  }).readOnly(),

  normalized: Ember.computed('raw', 'reduce', function() {
    let reduce = this.get('reduce');
    let group = this.get('raw');
    let host = this.get('content');

    if (reduce) {
      switch (typeof reduce) {
        case 'function': group.reduceSum(reduce); break;
        case 'object': group.reduce(reduce.add.bind(host), reduce.remove.bind(host), reduce.init.bind(host)); break;
        default: group.reduceCount(); break;
      }
    }

    return Object.create(group);
  }).readOnly(),

  // Hint: Use {{compute}} to grab the result
  top: filterAppliedProperty(function(group) {
    return k => {
      return group.top(typeof k === 'undefined' ? Infinity : Number(k)).map(wrapGroupObject);
    };
  }),

  size: filterAppliedProperty(function(group) {
    return group.size();
  }),

  all: filterAppliedProperty(function(group) {
    let array = group.all().map(wrapGroupObject);

    array.forEach(item => {
      array[item.key] = item;
    });

    return array;
  }),

  value: filterAppliedProperty(function(group) {
    return group.value();
  }),

  destroy() {
    this._super(...arguments);

    this.get('normalized').dispose();
  },

  toStringExtension() {
    return 'group';
  }
}).reopenClass({
  attachTo(configurations, options) {
    let groups = configurations.map(({ name, accessor, reduce }) => {
      return this
        .extend({
          reduce: reduce && reduce.accessor
        })
        .create({
          parent: options.parent,
          content: options.host,
          name,
          accessor
        });
    });
    let bindable = Ember.ArrayProxy.create({
      content: groups
    });

    groups
      .forEach(group => {
        bindable.set(group.get('name'), group);
      });

    groups
      .filter(group => group.get('accessor') !== 'all')
      .forEach(group => {
        options.parent.set(group.get('name'), group);
      });

    groups
      .filter(group => group.get('accessor') === 'all')
      .forEach(group => {
        let name = group.get('name');
        let desc = Ember.computed
          .readOnly(`groups.${name}.value`)
          .meta({ isGroupAllProperty: true })

        // Ember.defineProperty is private, need better solution
        Ember.defineProperty(options.parent, name, desc);
      });

    return bindable;
  }
});
