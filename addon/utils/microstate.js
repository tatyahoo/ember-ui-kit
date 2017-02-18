import Ember from 'ember';

export function setMicrostateNumber(object, key, newValue) {
  let oldValue = Ember.get(object, key);
  let isAttr = Ember.hasOwnProperty.call(object.attrs || {}, key);

  Ember.run.join(() => {
    // primitive
    if (typeof oldValue === 'number') {
      if (isAttr) {
        object.attrs[key].update(newValue);
      }
      else {
        Ember.set(object, key, newValue);
      }
    }
    // microstate
    else if (oldValue instanceof Number) {
      oldValue.set(newValue);
    }
  });

  return newValue;
}
