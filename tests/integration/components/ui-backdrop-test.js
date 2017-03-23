import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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

test('it renders a simple backdrop in block form', function(assert) {
  this.on('backdrop', function() {
    assert.ok('backdrop');
  });

  this.render(hbs`
    <style>
      #content {
        height: 100px;
        margin: 50px;
      }
    </style>
    <div id="content">
      CONTENT CONTENT CONTENT CONTENT CONTENT
      {{#ui-backdrop click=(event (action "backdrop") selfOnly=true)}}
        {{#ui-position options=(hash my="left top" at="left bottom")}}
          POSITIONED
        {{/ui-position}}
      {{/ui-backdrop}}
    </div>
  `);

  this.$('.ui-position').click();
  this.$('.ui-backdrop').click();

  assert.ok(this.$('.ui-backdrop').children().is('.ui-position'));

  assert.expect(2);
});
