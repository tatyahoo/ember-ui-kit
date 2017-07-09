import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { fillIn, focus, blur } from 'ember-native-dom-helpers';
import sinon from 'sinon';

const INPUT_SELECTOR = '.in-text input';

moduleForComponent('in-text', 'Integration | Component | in-text', {
  integration: true
});

test('it allows two-way binding with help', async function(assert) {
  this.set('value', 'Hello');

  this.render(hbs`{{in-text value on-input=(action (mut value))}}`);

  let el = this.$(INPUT_SELECTOR);

  assert.equal(el.val(), 'Hello', 'should bind value down');

  await fillIn(INPUT_SELECTOR, 'World');

  assert.equal(el.val(), 'World', 'should allow value change');
  assert.equal(this.get('value'), 'World', 'should allow value change be bound');
});

test('it triggers focus/blur action', async function(assert) {
  let onFocusAction = sinon.spy();
  let onBlurAction = sinon.spy();

  this.on('focus', onFocusAction);
  this.on('blur', onBlurAction);

  this.render(hbs`{{in-text on-focus=(action "focus") on-blur=(action "blur")}}`);

  let component = this.$('.in-text');

  await focus(INPUT_SELECTOR);

  assert.ok(onFocusAction.called);
  assert.ok(component.is('.in-text--focus'));

  await blur(INPUT_SELECTOR);

  assert.ok(onBlurAction.called);
  assert.ok(component.is('.in-text--blur'));
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

  assert.equal(this.$('.in-text__prefix .in-text__prefix').length, 1, 'render component prefix')
  assert.equal(this.$('.in-text__postfix .in-text__postfix').length, 1, 'render component postfix')
});
