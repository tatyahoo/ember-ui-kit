import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

import { click } from 'ember-native-dom-helpers';

import Ember from 'ember';

moduleForComponent('in-select', 'Integration | Component | in-select', {
  integration: true
});

test('select list renders synchronously', function(assert) {
  this.set('array', [
    {
      name: 'Link'
    },
    {
      name: 'Zelda'
    }
  ]);

  this.render(hbs`
    {{#in-select key="name" from=array as |items|}}
      <ul>
        {{#each items as |item|}}
          <li>{{item.name}}</li>
        {{/each}}
      </ul>
    {{/in-select}}
  `);

  assert.equal(this.$('li').toArray().map(str => Ember.$(str).text().trim()).join(' '), 'Link Zelda');
});

test('selecting triggers change event', async function(assert) {
  let spy = sinon.spy();

  this.set('array', [
    {
      name: 'Link'
    },
    {
      name: 'Zelda'
    }
  ]);
  this.on('trigger', spy);

  this.render(hbs`
    {{in-select value=value key="name" labelPath="name" from=array change=(event (action "trigger"))}}
    <hr>
    {{value.name}}
  `);

  assert.notOk(spy.called);

  await click('li:nth-child(1)')

  assert.ok(spy.called);
});
