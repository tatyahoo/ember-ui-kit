import Ember from 'ember';

/**
 * Utilities that provide integration with `ember-microstates`
 *
 * @private
 */
export default Object.freeze({
  // TODO handle list
  // TODO handle object
  // TODO handle select
  // TODO handle string
  isMicrostate(object) {
    if (typeof object === 'object') {
      let asPrimitive = object.valueOf();

      if (typeof asPrimitive !== 'object') {
        return true;
      }
    }

    return false;
  },

  toggle(object, key) {
    let oldValue = Ember.get(object, key);

    Ember.run.join(() => {
      if (this.isMicrostate(oldValue)) {
        oldValue.toggle();
      }
      else {
        let isAttr = Ember.hasOwnProperty.call(object.attrs || {}, key);
        let newValue = !oldValue;

        if (isAttr) {
          object.attrs[key].update(newValue);
        }
        else {
          Ember.set(object, key, newValue);
        }
      }
    });
  },

  set(object, key, newValue) {
    let oldValue = Ember.get(object, key);

    Ember.run.join(() => {
      if (this.isMicrostate(oldValue)) {
        oldValue.set(newValue);
      }
      else {
        let isAttr = Ember.hasOwnProperty.call(object.attrs || {}, key);

        if (isAttr) {
          object.attrs[key].update(newValue);
        }
        else {
          Ember.set(object, key, newValue);
        }
      }
    });
  }
});
