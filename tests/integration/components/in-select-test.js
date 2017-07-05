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

test('linked lists can be cleared with help', async function(assert) {
  this.set('array1', [
    {
      name: 'L',
      array2: [
        { name: 'K' },
        { name: 'A' }
      ]
    },
    {
      name: 'Z',
      array2: [
        { name: 'N' },
        { name: 'D' }
      ]
    }
  ]);
  this.set('value1', this.get('array1')[0]);
  this.set('value2', this.get('array1')[0].array2[0]);

  this.render(hbs`
    {{in-select key="name" from=array1 value=value1 labelPath="name" change=(event (action (mut value2) null))}}
    {{in-select key="name" from=value1.array2 value=value2 labelPath="name"}}

    <div>{{value1.name}} {{value2.name}}</div>
  `);

  assert.equal(this.$('.in-select:nth(0) li').toArray().map(el => el.textContent.trim()).join(), 'L,Z')
  assert.equal(this.$('div:last').text(), 'L K');

  await click('.in-select:nth-child(1) li:nth-child(2)');

  assert.equal(this.$('.in-select:nth(1) li').toArray().map(el => el.textContent.trim()).join(), 'N,D')
  assert.equal(this.$('div:last').text().trim(), 'Z');
});
