import Ember from 'ember';
import DS from 'ember-data';

import SelectionProxy from './proxy';

import _ from 'lodash';

function find(list, target) {
  return Ember.A(list).find(item => {
    if (target === item) {
      return true;
    }

    if (item instanceof SelectionProxy && item.get('content') === target) {
      return true;
    }

    for (let key in target) {
      if (target[key] !== Ember.get(item, key)) {
        return false;
      }
    }

    return true;
  });
}

function flattenProxy(obj) {
  if (obj instanceof Ember.ArrayProxy) {
    return obj.toArray();
  }

  if (obj instanceof SelectionProxy) {
    return obj;
  }

  if (Ember._ProxyMixin.detect(obj)) {
    return flattenProxy(obj.get('content'));
  }

  return obj;
}

function normalizeSelect(list, selected) {
  let normal = {
    list: flattenProxy(list).map(flattenProxy),
    selected: flattenProxy(selected).map(flattenProxy)
  };

  return normal.selected.map(item => {
    Ember.assert('`selectable` expect selected item of type object or number', typeof item === 'number' || typeof item === 'object');

    if (typeof item === 'number') {
      return normal.list[item];
    }

    if (item instanceof SelectionProxy) {
      return find(normal.list, item.get('content'));
    }

    return find(normal.list, item);
  });
}

export default Ember.Object.extend({
  meta: null,

  list: null,

  isSelectable: true,

  items: Ember.computed.readOnly('listNormalized'),
  listNormalized: Ember.computed('list', 'meta', function() {
    let { list, meta } = this.getProperties('list', 'meta');

    return DS.PromiseArray.create({
      promise: list.then(items => {
        let selected = meta.select.map(item => {
          if (typeof item === 'number') {
            return items[item];
          }

          return find(items, item);
        });

        return items.map((item, index) => {
          return SelectionProxy.create({
            isSelected: _.includes(selected, item),
            content: item,
            index
          });
        });
      })
    });
  }).readOnly(),

  selected: Ember.computed('listNormalized.@each.isSelected', function() {
    return DS.PromiseArray.create({
      promise: this.get('listNormalized').then(items => {
        let limit = this.get('meta.limit');

        let selected = Ember.A(items)
          .filterBy('isSelected', true)
          .sort((left, right) => {
            return left.get('index') - right.get('index');
          })
          .map((item, index) => {
            item.set('index', index);

            return item.get('content');
          });

        while (selected.length > limit) {
          find(items, selected.shift()).set('isSelected', false);
        }

        return selected;
      })
    });
  }).readOnly(),

  unselected: Ember.computed('listNormalized.@each.isSelected', function() {
    return DS.PromiseArray.create({
      promise: this.get('listNormalized').then(items => {
        return Ember.A(items).filterBy('isSelected', false);
      })
    });
  }).readOnly(),

  init() {
    this._super(...arguments);

    this.select = this.select.bind(this);
    this.unselect = this.unselect.bind(this);
    this.clear = this.clear.bind(this);
  },

  select(items) {
    let toSelect = [].concat(items);

    return Ember.run.join(() => {
      let list = this.get('listNormalized');
      let len = list.get('length');

      // run loop for fast flush
      Ember.run(() => {
        normalizeSelect(list, toSelect).forEach((selection, index) => {
          selection.set('isSelected', true);
          selection.set('index', len + index);
        });

        // immediately refresh CP
        return this.get('selected');
      });

      return this;
    });
  },

  unselect(items) {
    let toUnselect = [].concat(items);
    let list = this.get('listNormalized');

    Ember.run.join(() => {
      normalizeSelect(list, toUnselect).forEach(selection => {
        selection.set('isSelected', false);
        selection.set('index', null);
      });

      // immediately refresh CP
      return this.get('selected');
    });
  },

  clear() {
    Ember.run.join(() => {
      this.get('listNormalized').invoke('set', 'isSelected', false);
    });
  }
});
