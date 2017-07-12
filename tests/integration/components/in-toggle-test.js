import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { focus, blur, click } from 'ember-native-dom-helpers';
import sinon from 'sinon';

const INPUT_SELECTOR = '.in-toggle input';

moduleForComponent('in-toggle', 'Integration | Component | in-toggle', {
  integration: true
});

test('it is a bindable input', async function(assert) {
  this.set('value', false);

  this.render(hbs`
    {{in-toggle value}}
  `);

  await click(INPUT_SELECTOR);

  assert.ok(this.$(INPUT_SELECTOR).is(':checked'));

  await click(INPUT_SELECTOR);

  assert.notOk(this.$(INPUT_SELECTOR).is(':checked'));
});

test('it triggers focus/blur action', async function(assert) {
  let onFocusAction = sinon.spy();
  let onBlurAction = sinon.spy();

  this.on('focus', onFocusAction);
  this.on('blur', onBlurAction);

  this.render(hbs`{{in-toggle on-focus-in=(action "focus") on-focus-out=(action "blur")}}`);

  let component = this.$('.in-toggle');

  await focus(INPUT_SELECTOR);

  assert.ok(onFocusAction.called);
  assert.ok(component.is('.in-toggle--focus'));

  await blur(INPUT_SELECTOR);

  assert.ok(onBlurAction.called);
  assert.ok(component.is('.in-toggle--blur'));
});
