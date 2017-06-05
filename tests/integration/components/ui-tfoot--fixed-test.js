import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-tfoot--fixed', 'Integration | Component | ui tfoot  fixed', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui-tfoot--fixed}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui-tfoot--fixed}}
      template block text
    {{/ui-tfoot--fixed}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
