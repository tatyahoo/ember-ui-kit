import Ember from 'ember';
import { construct } from 'ember-ui-kit/utils/computed';
import { module, test } from 'qunit';

module('Unit | Utility | computed');

test('it works', function(assert) {
  let result = Ember.Object
    .extend({
      array: construct(Ember.A),
      object: construct(Object)
    })
    .create();

  assert.equal(Ember.typeOf(result.get('array')), 'array');
  assert.equal(Ember.typeOf(result.get('object')), 'object');
});
