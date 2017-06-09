import Ember from 'ember';
import layout from '../templates/components/in-select';

import { task } from 'ember-concurrency';

function robustRemove(list, target, key) {
  if (list.removeObject) {
    if (key) {
      list.removeObject(list.findBy(key, Ember.get(target, key)));
    }
    else {
      list.removeObject(target);
    }
  }
  else {
    if (key) {
      list.splice(list.indexOf(Ember.A(list).findBy(key, Ember.get(target, key))), 1);
    }
    else {
      list.splice(list.indexOf(target), 1);
    }
  }
}

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

  fromNormalized: Ember.computed('from', function() {
    let from = this.get('from');

    if (typeof from === 'function') {
      from = from();
    }

    return from;
  }).readOnly(),

  multiple: Ember.computed('value', function() {
    return Ember.isArray(this.get('value'));
  }).readOnly(),

  list: Ember.computed('resolveFrom.last.value', function() {
    return Ember.A((this.get('resolveFrom.last.value') || []).slice());
  }).readOnly(),

  resolveFrom: task(function *() {
    let list = yield this.get('fromNormalized');
    let value = yield this.get('value');

    if (!Ember.isEmpty(value)) {
      let key = this.get('key');
      let multiple = this.get('multiple');

      let aList = Ember.A((list || []).slice());

      if (!multiple) {
        let found = aList.findBy(key, Ember.get(value, key));

        if (!found) {
          this.set('value', multiple ? [] : null);
        }
      }
      else {
        value.slice().forEach(val => {
          let found = aList.findBy(key, Ember.get(val, key))

          if (!found) {
            robustRemove(value, val, key);
          }
        });
      }
    }

    return list;
  }).restartable(),

  isSelected: Ember.computed('key', 'value.[]', function() {
    let key = this.get('key');
    let value = this.get('value');

    if (!Ember.isEmpty(value) && !Ember.isArray(value)) {
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

  fromNormalizedChanged: Ember.observer('fromNormalized', function() {
    Ember.run.once(this.get('resolveFrom'), 'perform');
  }),

  init() {
    this._super(...arguments);

    Ember.run(this.get('resolveFrom'), 'perform');
  },

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

      Ember.$(this.$()).change();
    },

    unselect(item) {
      if (this.get('multiple')) {
        let key = this.get('key');
        let value = this.get('value');

        robustRemove(value, item, key);
      }
      else {
        this.set('value', null);
      }

      Ember.$(this.$()).change();
    },

    toggle(item) {
      let check = this.get('isSelected');

      if (check(item)) {
        this.send('unselect', item);
      }
      else {
        this.send('select', item);
      }

      Ember.$(this.$()).change();
    }
  }
}).reopenClass({
  positionalParams: ['value']
});
