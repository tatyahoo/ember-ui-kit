import Ember from 'ember';

export function construct(Constructor, ...args) {
  return Ember.computed(function() {
    return new Constructor(...args);
  });
}
