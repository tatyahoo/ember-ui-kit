import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
