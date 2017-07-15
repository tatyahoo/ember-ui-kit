import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';

import sinon from 'sinon';

moduleForComponent('ui-anchor-switch', 'Integration | Component | ui-anchor', {
  integration: true,

  beforeEach() {
    this.set('position', 2);

    this.on('position-update', this.update = sinon.spy());

    this.render(hbs`
      <style>
        .ui-anchor-switch {
          width: 640px;
          height: 200px;
          margin: 50px auto;
          border: 1px solid darkblue;
        }

        .ui-anchor-case {
          width: 100%;
          height: 160px;
        }

        .ui-anchor-case:nth-child(even) div {
          background: lightblue;
        }

        h1 {
          text-align: center;
          margin: 0;
          padding: 0;
        }
      </style>

      {{#ui-anchor-switch position on-change=(action "position-update") as |anchor|}}
        {{#each (array 0 1 2 3 4 5 6 7 8 9) as |section|}}
          {{#anchor.case section}}
            <div>
              <h1>{{section}}</h1>
            </div>
          {{/anchor.case}}
        {{/each}}
      {{/ui-anchor-switch}}
    `);
  }
});

test('it binds data down', async function(assert) {
  await new Ember.RSVP.Promise(requestAnimationFrame);

  assert.equal(this.$('.ui-anchor-switch').scrollTop(), 320);

  this.set('position', 0);

  await new Ember.RSVP.Promise(requestAnimationFrame);

  assert.equal(this.$('.ui-anchor-switch').scrollTop(), 0);
});

test('it fire action up', async function(assert) {
  this.update.reset();

  this.$('.ui-anchor-switch').scrollTop(0);

  await new Ember.RSVP.Promise(requestAnimationFrame);

  assert.ok(this.update.calledWith(0));
});
