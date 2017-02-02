import Ember from 'ember';

export default class SelectableComputed extends Ember.ComputedProperty {
  constructor() {
    super(...arguments);

    this.meta({
      selectable: {
        select: [],
        from: [],
        limit: Infinity
      }
    });

    this.readOnly();
  }

  select(...selected) {
    this.meta().selectable.select = [].concat(...selected);

    return this;
  }

  from(list) {
    Ember.assert('`selectable` expect a function, array, or dependent key string', Ember.isArray(list) || typeof list === 'string' || typeof list === 'function');

    this.meta().selectable.from = list;

    if (typeof list === 'string') {
      this.property(list);
    }

    return this;
  }

  limit(value) {
    this.meta().selectable.limit = value;

    return this;
  }
}
