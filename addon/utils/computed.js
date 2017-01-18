import Ember from 'ember';

export function construct(ctor, ...args) {
  return Ember.computed(function() {
    return new ctor(...args);
  });
}
