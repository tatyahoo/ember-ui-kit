import Ember from 'ember';
import DS from 'ember-data';
import layout from '../templates/components/in-select';

/**
 * @public
 * @module input
 * @class SelectInputComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  classNames: 'in-select',
  layout,

  /**
   * The selected option. The select is multi select if `value` is bound
   * an array-like object.
   *
   * `value` makes no garantee about object identity correctness. This means
   * `value` may contain value that does not match `from` content by strict
   * equal `===`. `value` does garantee the object match by configured `key`.
   *
   * @attribute value
   */
  value: null,

  /**
   * @attribute from
   */
  from: null,

  /**
   * @attribute key
   */
  key: null,

  multiple: Ember.computed('value', function() {
    return Ember.isArray(this.get('value'));
  }).readOnly(),

  /**
   * @property list
   */
  list: Ember.computed('from', function() {
    let from = this.get('from');

    if (typeof from === 'function') {
      from = from();
    }

    return DS.PromiseArray.create({
      promise: Ember.RSVP.resolve(from)
    });
  }).readOnly(),

  isSelected: Ember.computed('key', 'value.[]', function() {
    let key = this.get('key');
    let value = this.get('value');

    if (!Ember.isArray(value)) {
      value = [ value ];
    }

    value = Ember.A(value);

    if (key) {
      value = value.mapBy(key);

      return item => {
        return value.includes(Ember.get(item, key));
      };
    }
    else {
      return item => {
        return value.includes(item);
      };
    }
  }).readOnly(),

  actions: {
    select(item) {
      if (this.get('multiple')) {
        let key = this.get('key');
        let value = this.get('value');

        let exists = key ?
          Ember.A(value).findBy(key, Ember.get(item, key)) :
          Ember.A(value).includes(item);

        if (!exists) {
          if (value.pushObject) {
            value.pushObject(item);
          }
          else {
            value.push(item);
          }
        }
      }
      else {
        this.set('value', item);
      }
    },

    unselect(item) {
      if (this.get('multiple')) {
        let key = this.get('key');
        let value = this.get('value');

        if (value.removeObject) {
          if (key) {
            value.removeObject(value.findBy(key, Ember.get(item, key)));
          }
          else {
            value.removeObject(item);
          }
        }
        else {
          if (key) {
            value.splice(value.indexOf(Ember.A(value).findBy(key, Ember.get(item, key))), 1);
          }
          else {
            value.splice(value.indexOf(item), 1);
          }

        }
      }
      else {
        this.set('value', null);
      }
    },

    toggle(item) {
      let check = this.get('isSelected');

      if (check(item)) {
        this.send('unselect', item);
      }
      else {
        this.send('select', item);
      }
    }
  }
}).reopenClass({
  positionalParams: ['value']
});
