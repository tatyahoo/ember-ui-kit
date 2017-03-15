import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('fm-form', 'Unit | Component | fm-form', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('#model', function(assert) {
  let component = this.subject();

  assert.throws(function() {
    component.set('model', []);
  });

  component.set('model', null);

  component.set('model', undefined);

  component.set('model', {});
});
