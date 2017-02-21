import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fm-field', 'Integration | Component | fm-field', {
  integration: true
});

// TODO test('it allows simple validation: presence', function(assert) { });
// TODO test('it allows simple validation: length', function(assert) { });

test('it allows unidirectional data flow in validation', function(assert) {
  this.set('value', 'Hello');

  this.render(hbs`
    {{#fm-field (validate value update=(action (mut value))) as |in|}}
      {{in.text}}
    {{/fm-field}}
  `);

  assert.equal(this.$('.fm-field').length, 1, 'should render form field');
  assert.equal(this.$('.fm-field .in-text').length, 1, 'should render text field inside form field');
  assert.equal(this.$('.in-text').val(), 'Hello', 'should bind field value to text field');

  this.$('.in-text').val('World').change();

  assert.equal(this.$('.in-text').val(), 'World', 'should be changeable');
  assert.equal(this.get('value'), 'World', 'should change be bound');
});
