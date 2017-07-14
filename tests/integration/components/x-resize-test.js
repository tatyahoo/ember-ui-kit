import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('x-resize', 'Integration | Component | x-resize', {
  integration: true
});

test('it renders', function(assert) {
  // Template block usage:
  this.render(hbs`
    {{#x-resize}}
      template block text
    {{/x-resize}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');

  //return new Ember.RSVP.Promise(Ember.$.noop);
});
