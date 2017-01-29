import Ember from 'ember';

export function observerOnce(...args) {
  let fn = args.pop();
  let keys = args;

  return Ember.observer(...keys, function() {
    Ember.run.once(this, fn);
  });
}

export function listenOnce(fn) {
  return function() {
    Ember.run.once(this, fn);
  };
}
