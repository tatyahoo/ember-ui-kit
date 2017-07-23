import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import sinon from 'sinon';

import Button from 'ember-ui-kit/components/ui-button/page-object';

moduleForComponent('ui-button', 'Integration | Component | ui-button', {
  integration: true,

  beforeEach() {
    document.querySelectorAll('#ember-testing-container,#ember-testing')
      .forEach(function(node) {
        node.scrollTop = 0;
      });

    this.po = new Button('.ui-button');
  }
});

test('it triggers click action', async function(assert) {
  let onClickAction = sinon.spy();

  this.on('click', onClickAction);

  this.render(hbs`{{ui-button "Cancel" on-click=(action "click")}}`);

  assert.equal(this.po.text, 'Cancel');

  await this.po.click();

  assert.ok(onClickAction.called, 'click action called');

  onClickAction.reset();

  this.render(hbs`
    {{#ui-button on-click=(action "click")}}
      <svg width="50" height="50">
      </svg>
    {{/ui-button}}
    {{ui-backdrop}}
  `);

  if (typeof document.elementsFromPoint === 'function') {
    assert.throws(() => {
      this.po.click();
    });
  }
});

test('it should bind disabled', async function(assert) {
  let onClickAction = sinon.spy();

  this.on('click', onClickAction);

  this.set('disabled', false);
  this.set('label', 'Save');

  this.render(hbs`
    {{ui-button label disabled=disabled on-click=(action "click")}}
  `);

  assert.ok(this.po.enabled);
  assert.equal(this.po.text, 'Save');
  assert.equal(this.po.value, 'Save');

  await this.po.click();

  assert.ok(onClickAction.called);

  onClickAction.reset();

  this.set('disabled', true);

  assert.ok(this.po.disabled);

  await this.po.click();

  assert.notOk(onClickAction.called);
});

test('it triggers focus/blur action', async function(assert) {
  let onFocusAction = sinon.spy();
  let onBlurAction = sinon.spy();

  this.on('focus', onFocusAction);
  this.on('blur', onBlurAction);

  this.render(hbs`{{ui-button on-focus-in=(action "focus") on-focus-out=(action "blur")}}`);

  let btn = new Button('.ui-button');

  await btn.focus();

  assert.ok(onFocusAction.called, 'focus action called');

  await btn.blur();

  assert.ok(onBlurAction.called, 'blur action called');
});
