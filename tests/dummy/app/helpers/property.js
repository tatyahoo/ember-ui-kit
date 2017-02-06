import Ember from 'ember';

export function property([ path ]) {
  return function(obj) {
    return Ember.get(obj, path);
  };
}

export default Ember.Helper.helper(property);
