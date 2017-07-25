import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import sinon from 'sinon';

import TextInput from 'ember-ui-kit/components/in-text/page-object';

moduleForComponent('in-text', 'Integration | Component | in-text', {
  integration: true,

  beforeEach() {
    this.po = new TextInput('.in-text');
  }
});

test('it should never show null and undefined', function(assert) {
  [ null, undefined ].forEach(value => {
    this.set('value', value);

    this.render(hbs`
      {{in-text value}}
    `);

    assert.equal(this.po.value, '');
  });
});

test('it should bind disabled', function(assert) {
  this.set('disabled', false);

  this.render(hbs`
    {{in-text value disabled=disabled}}
  `);

  assert.ok(this.po.enabled);

  this.set('disabled', true);

  assert.ok(this.po.disabled);
});

test('it allows two-way binding with help', async function(assert) {
  this.set('value', 'Hello');

  this.render(hbs`
    {{in-text value on-input=(action (mut value))}}
  `);

  let input = new TextInput('.in-text');

  await input.fillIn('Hello');

  assert.equal(input.value, 'Hello', 'should bind value down');

  await input.fillIn('World');

  assert.equal(input.value, 'World', 'should allow value change');
  assert.equal(this.get('value'), 'World', 'should allow value change be bound');
});

test('it triggers focus/blur action', async function(assert) {
  let onFocusAction = sinon.spy();
  let onBlurAction = sinon.spy();

  this.on('focus', onFocusAction);
  this.on('blur', onBlurAction);

  this.render(hbs`{{in-text on-focus-in=(action "focus") on-focus-out=(action "blur")}}`);

  let input = new TextInput('.in-text');

  await input.focus();

  assert.ok(onFocusAction.called, 'focus action called');

  await input.blur();

  assert.ok(onBlurAction.called, 'blur action called');
});

test('it renders prefix and postfixes', function(assert) {
  this.render(hbs`
    {{in-text "value"
      prefix="text prefix"
      postfix="text postfix"
    }}
  `);

  assert.equal(this.$('.in-text__prefix').text(), 'text prefix', 'renders text prefix');
  assert.equal(this.$('.in-text__postfix').text(), 'text postfix', 'renders text postfix');

  this.render(hbs`
    {{in-text "value"
      prefix=(component "in-text")
      postfix=(component "in-text")
      autofocus=true
    }}
  `);

  assert.equal(this.$('.in-text__prefix .in-text__infix').length, 1, 'render component prefix')
  assert.equal(this.$('.in-text__postfix .in-text__infix').length, 1, 'render component postfix')
});
