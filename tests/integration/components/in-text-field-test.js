import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('in-text-field', 'Integration | Component | in-text-field', {
  integration: true
});

test('it allows two-way binding', function(assert) {
  this.set('value', 'Hello');

  this.render(hbs`{{in-text-field (mut value)}}`);

  let el = this.$('.in-text-field');

  assert.equal(el.val(), 'Hello', 'should bind value down');

  el.val('World').change();

  assert.equal(el.val(), 'World', 'should allow value change');
  assert.equal(this.get('value'), 'World', 'should allow value change be bound');
});
