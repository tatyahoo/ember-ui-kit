import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import Microstates from 'ember-microstates/initializers/microstates';

moduleForComponent('in-toggle', 'Integration | Component | in-toggle', {
  integration: true
});

test('it is a bindable input', function(assert) {
  Microstates.initialize(this);

  this.render(hbs`
    {{#in-toggle (Boolean false) as |on|}}
      On: {{on}}
    {{/in-toggle}}
  `);

  assert.equal(this.$('.in-toggle').text().trim(), 'On: false', 'should init as false');

  this.$('.in-toggle').click();

  assert.equal(this.$('.in-toggle').text().trim(), 'On: true', 'should click to true');
});
