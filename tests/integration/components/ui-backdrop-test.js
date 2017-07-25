import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import sinon from 'sinon';

import Backdrop from 'ember-ui-kit/components/ui-backdrop/page-object';
import Button from 'ember-ui-kit/components/ui-button/page-object';

moduleForComponent('ui-backdrop', 'Integration | Component | ui-backdrop', {
  integration: true
});

test('it renders a simple backdrop in inline form', function(assert) {
  this.render(hbs`
    <style>
      #content {
        height: 100px;
        margin: 50px;
      }
    </style>
    <div id="content">
      CONTENT CONTENT CONTENT CONTENT CONTENT
      {{ui-backdrop}}
      {{#ui-position options=(hash my="left top" at="left bottom")}}
        POSITIONED
      {{/ui-position}}
    </div>
  `);

  let { top, left } = this.$('.ui-position').get(0).getBoundingClientRect();

  let [ position, backdrop ] = document.elementsFromPoint(left + 5, top + 5);

  assert.ok(this.$('.ui-position').is(position));
  assert.ok(this.$('.ui-backdrop').is(backdrop));

  assert.ok(this.$('.ui-backdrop').next().is('.ui-position'));
});

test('it renders a simple backdrop in block form', async function(assert) {
  let onBackdropClick = sinon.spy();
  let onButtonClick = sinon.spy();
  let po = new Backdrop('.ui-backdrop', {
    content: new Button('.ui-button')
  });

  this.on('backdrop', onBackdropClick);
  this.on('button', onButtonClick);

  this.render(hbs`
    <style>
      #content {
        height: 100px;
        margin: 50px;
      }
    </style>
    <div id="content">
      CONTENT CONTENT CONTENT CONTENT CONTENT
      {{#ui-backdrop on-click=(action "backdrop")}}
        {{#ui-position options=(hash my="left top" at="left bottom")}}
          {{ui-button "POSITIONED" on-click=(action "button")}}
        {{/ui-position}}
      {{/ui-backdrop}}
    </div>
  `);

  await po.content.click();

  assert.notOk(onBackdropClick.called, 'on button click, backdrop not clicked');
  assert.ok(onButtonClick.called, 'on button click, button clicked');

  onBackdropClick.reset();
  onButtonClick.reset();

  await po.click();

  assert.notOk(onButtonClick.called, 'on backdrop click, backdrop clicked');
  assert.ok(onBackdropClick.called, 'on backdrop click, button not clicked');
});
