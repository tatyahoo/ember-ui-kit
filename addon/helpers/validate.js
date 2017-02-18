import Ember from 'ember';

export class Validatable {
  constructor(value, options = {}) {
    this.value = value;
    this.update = options.update || Ember.$.noop;
    this.results = options.results;
  }
}

export function validate([ value ], hash) {
  if (value instanceof Validatable) {
    return value;
  }

  return new Validatable(value, hash);
}

export default Ember.Helper.helper(validate);
