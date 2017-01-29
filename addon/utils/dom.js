import Ember from 'ember';

const PLACEHOLDER = Ember.$(document.createTextNode(''));

export function swapNodes(...args) {
  let [ left, right ] = args.map(Ember.$);

  PLACEHOLDER.insertBefore(left);

  left.insertBefore(right);
  right.insertAfter(PLACEHOLDER);

  PLACEHOLDER.remove();
}
