import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import Microstates from 'ember-microstates/initializers/microstates';

moduleForComponent('fm-field', 'Integration | Component | fm-field', {
  integration: true
});

// TODO test('it allows simple validation: presence', function(assert) { });
// TODO test('it allows simple validation: length', function(assert) { });

test('it allows unidirectional data flow in validation', function(assert) {
  Microstates.initialize(this);

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

test('it works without validations too', function(assert) {
  Microstates.initialize(this);

  this.set('value', 'Hello');

  this.render(hbs`
    {{#fm-field (mut value) as |in|}}
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

test('it works without mutation', function(assert) {
  Microstates.initialize(this);

  this.set('value', 'Hello');

  this.render(hbs`
    {{#fm-field (readonly value) as |in|}}
      {{in.text}}
    {{/fm-field}}
  `);

  assert.equal(this.$('.fm-field').length, 1, 'should render form field');
  assert.equal(this.$('.fm-field .in-text').length, 1, 'should render text field inside form field');
  assert.equal(this.$('.in-text').val(), 'Hello', 'should bind field value to text field');

  this.$('.in-text').val('World').change();

  assert.equal(this.$('.in-text').val(), 'World', 'should be changeable in element');
  assert.equal(this.get('value'), 'Hello', 'should change not be bound back');
});
