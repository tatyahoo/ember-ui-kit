import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';

moduleForComponent('ui-position', 'Integration | Component | ui-position', {
  integration: true
});

test('it positions itself', function(assert) {
  this.render(hbs`
    <style>
      .container {
        margin: 50px 100px;
        width: 100px;
        height: 100px;
      }
    </style>

    <div class="container">
      {{#ui-position}}
        template block text
      {{/ui-position}}
    </div>
  `);

  assert.equal(this.$('.ui-position').text().trim(), 'template block text');
});

test('it positions correctly when nested', function(assert) {
  this.render(hbs`
    {{#ui-backdrop}}
      {{#ui-position}}
        CONTENT Level 1
        {{ui-backdrop}}
        {{#ui-position options=(hash my="left top" at="left bottom")}}
          CONTENT Level 2
        {{/ui-position}}
      {{/ui-position}}
    {{/ui-backdrop}}
  `);

  let inner = this.$('.ui-position .ui-position');
  let outer = inner.parent().closest('.ui-position');

  let iRect = inner.get(0).getBoundingClientRect();
  let oRect = outer.get(0).getBoundingClientRect();

  let iEl = Ember.$(document.elementsFromPoint(iRect.left + 2, iRect.top + 2));
  let oEl = Ember.$(document.elementsFromPoint(oRect.left + 2, oRect.top + 2));

  assert.ok(iEl.eq(0).is('.ui-position'));
  assert.ok(iEl.eq(1).is('.ui-backdrop'));
  assert.ok(iEl.eq(2).is('.ui-backdrop'));

  assert.ok(oEl.eq(0).is('.ui-backdrop'));
  assert.ok(oEl.eq(1).is('.ui-position'));
  assert.ok(oEl.eq(2).is('.ui-backdrop'));

});
