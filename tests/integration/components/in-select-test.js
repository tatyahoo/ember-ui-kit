import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
