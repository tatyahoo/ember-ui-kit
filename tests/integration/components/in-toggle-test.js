import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import ToggleInput from 'ember-ui-kit/test-support/pages/components/in-toggle';
import sinon from 'sinon';

moduleForComponent('in-toggle', 'Integration | Component | in-toggle', {
  integration: true
});

test('it is a bindable input', async function(assert) {
  this.set('value', false);

  this.render(hbs`
    {{in-toggle value on-change=(action (mut value))}}
  `);

  let input = new ToggleInput(this);

  await input.click();

  assert.ok(input.is('.in-toggle--on'));

  await input.click();

  assert.ok(input.is('.in-toggle--off'));
});

test('it should bind disabled', function(assert) {
  this.set('disabled', false);

  this.render(hbs`
    {{in-toggle value disabled=disabled}}
  `);

  assert.equal(this.$('.in-toggle input').is(':disabled'), false);

  this.set('disabled', true);

  assert.equal(this.$('.in-toggle input').is(':disabled'), true);
});

test('it triggers focus/blur action', async function(assert) {
  let onFocusAction = sinon.spy();
  let onBlurAction = sinon.spy();

  this.on('focus', onFocusAction);
  this.on('blur', onBlurAction);

  this.render(hbs`{{in-toggle on-focus-in=(action "focus") on-focus-out=(action "blur")}}`);

  let input = new ToggleInput(this);

  await input.focus();

  assert.ok(onFocusAction.called);
  assert.ok(input.is('.in-toggle--focus'));

  await input.blur();

  assert.ok(onBlurAction.called);
  assert.ok(input.is('.in-toggle--blur'));
});
