import Ember from 'ember';

function applyFilters() {
  this.get('crossfilter.dimensions').forEach(dimension => {
    dimension.get('normalized');
  });
}

export function filterAppliedProperty(...args) {
  let fn = args.pop();
  let keys = args;

  return Ember.computed('crossfilter.dimensions.@each.filter', 'normalized', ...keys, function() {
    applyFilters.call(this);

    return fn.call(this, this.get('normalized'));
  }).readOnly();
}

export default class CrossfilterComputed extends Ember.ComputedProperty {
  constructor() {
    super(...arguments);

    this.meta({
    });

    this.readOnly();
  }

  from(list, accessor) {
    Ember.assert('`crossfilter` expect a function, array, or dependent key string', Ember.isArray(list) || typeof list === 'string' || typeof list === 'function');

    let meta = this.meta();

    meta.crossfilter = {
      type: 'crossfilter',
      accessor,
      parent: null,
      dimensions: [],
      groups: []
    };

    Object.defineProperty(meta.crossfilter, 'last', {
      value: meta.crossfilter,
      writable: true,
      enumerable: false
    });
    Object.defineProperty(meta.crossfilter, 'from', {
      value: list,
      enumerable: false
    });

    this.reconfigure();

    if (typeof list === 'string') {
      this.property(list.replace(/(\.\[\])?$/, ''));
    }

    return this;
  }

  reconfigure() {
    let meta = this.meta();
    let cf = meta.crossfilter;

    Object.defineProperty(cf.last, 'parent', {
      value: cf.last.parent,
      writable: false,
      enumerable: false
    });
  }

  firstOfType(node, type) {
    if (!node) {
      return null;
    }
    else if (node.type === type) {
      return node;
    }
    else {
      return this.firstOfType(node.parent, type);
    }
  }

  dimension(isArray, name, fn) {
    if (typeof isArray !== 'boolean') {
      [ isArray, name, fn ] = [ false, isArray, name ];
    }

    let meta = this.meta();
    let cf = meta.crossfilter;
    let last = cf.last;

    let crossfilter = this.firstOfType(last, 'crossfilter');

    Ember.assert('`dimension` must have a crossfilter as parent', crossfilter.type === 'crossfilter');

    crossfilter.dimensions.push(cf.last = {
      name: name || 'group',
      type: 'dimension',
      isArray,
      parent: crossfilter,
      accessor: fn,
      groups: []
    });

    this.reconfigure();

    return this;
  }

  dimensionWithArray(name, fn) {
    return this.dimension(true, name, fn);
  }

  group(name, fn) {
    let meta = this.meta();
    let cf = meta.crossfilter;
    let last = cf.last;
    let node = this.firstOfType(last, 'dimension')
      || this.firstOfType(last, 'crossfilter');

    if (typeof name === 'function') {
      fn = name;
      name = 'group';
    }

    node.groups.push(cf.last = {
      name: name || 'group',
      type: 'group',
      parent: node,
      accessor: fn,
      reduce: null
    });

    this.reconfigure();

    return this;
  }

  groupAll(name = 'all') {
    return this.group(name, 'all');
  }

  order(accessor) {
    let meta = this.meta();
    let cf = meta.crossfilter;
    let last = cf.last;
    let group = this.firstOfType(last, 'group');

    Ember.assert('`order` must have a group as parent', group.type === 'group');

    group.order = cf.last = {
      type: 'order',
      parent: group,
      accessor
    };

    this.reconfigure();

    return this;
  }

  orderNatural() {
    return this.order('natural');
  }

  reduce(accessor) {
    let meta = this.meta();
    let cf = meta.crossfilter;
    let last = cf.last;
    let group = this.firstOfType(last, 'group');

    Ember.assert('`reduce` must have a group as parent', group.type === 'group');

    group.reduce = cf.last = {
      type: 'reduce',
      parent: group,
      accessor
    };

    this.reconfigure();

    return this;
  }

  reduceSum(accessor) {
    let meta = this.meta();
    let cf = meta.crossfilter;
    let last = cf.last;
    let group = this.firstOfType(last, 'group');

    Ember.assert('`reduceSum` cannot by used on groupAll', group.accessor !== 'all');

    return this.reduce(accessor);
  }

  reduceCount() {
    let meta = this.meta();
    let cf = meta.crossfilter;
    let last = cf.last;
    let group = this.firstOfType(last, 'group');

    Ember.assert('`reduceCount` cannot by used on groupAll', group.accessor !== 'all');

    return this.reduce(null);
  }

  filter(accessor) {
    let meta = this.meta();
    let cf = meta.crossfilter;
    let last = cf.last;
    let dimension = this.firstOfType(last, 'dimension');

    Ember.assert('`filter` must have a dimension as parent', dimension.type === 'dimension');

    dimension.filter = cf.last = {
      type: 'filter',
      parent: dimension,
      accessor
    };

    this.reconfigure();

    return this;
  }

  filterAll() {
    Ember.assert('#filterAll not implemented');
    return this;
  }

  filterRange() {
    Ember.assert('#filterRange not implemented');
    return this;
  }

  filterFunction() {
    Ember.assert('#filterFunction not implemented');
    return this;
  }

  filterExact() {
    Ember.assert('#filterExact not implemented');
    return this;
  }

  // TODO teardown is not what's expected, any other way to detect destroy?
  //teardown(obj, keyName) {
  //  if (!this._volatile) {
  //    let meta = Ember.meta(obj);
  //    let cache = meta.readableCache();

  //    if (cache && cache[keyName] !== undefined) {
  //      cache[keyName].destroy();
  //    }
  //  }

  //  return this._super(...arguments);
  //}
}
