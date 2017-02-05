import Ember from 'ember';
import { observerOnce, observerOnceIn } from 'ember-ui-kit/utils/run';
import { module, test } from 'qunit';

module('Unit | Utility | run');

test('observerOnce', function(assert) {
  let order = [];
  let once = observerOnce(function() {
    order.push('action');
  });

  Ember.run.begin();
  once();
  once();
  once();
  once();
  Ember.run.schedule('destroy', function() { order.push('destroy'); });
  Ember.run.schedule('afterRender', function() { order.push('afterRender'); });
  Ember.run.schedule('sync', function() { order.push('sync'); });
  Ember.run.end();

  assert.deepEqual(order, [ 'sync', 'action', 'afterRender', 'destroy' ]);
});

test('observerOnceIn', function(assert) {
  let order = [];
  let once = observerOnceIn('afterRender', function() {
    order.push('afterRender');
  });

  Ember.run.begin();
  once();
  once();
  once();
  once();
  Ember.run.schedule('destroy', function() { order.push('destroy'); });
  Ember.run.schedule('afterRender', function() { order.push('afterRender'); });
  Ember.run.schedule('sync', function() { order.push('sync'); });
  Ember.run.end();

  assert.deepEqual(order, [ 'sync', 'afterRender', 'afterRender', 'destroy' ]);
});
