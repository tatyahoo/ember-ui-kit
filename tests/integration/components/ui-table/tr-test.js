import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-table/tr', 'Integration | Component | ui-table/tr', {
  integration: true
});

test('it registers and unregisters td', function(assert) {
  this.set('cells', [ { show: true }, { show: true }, { show: true }, { show: true } ]);

  this.render(hbs`
    {{#ui-table/tr as |t|}}
      {{#each cells key="@index" as |cell index|}}
        {{#if cell.show}}
          {{#t.d}}Cell {{index}}{{/t.d}}
        {{/if}}
      {{/each}}
    {{/ui-table/tr}}
  `);

  assert.equal(this.$('.ui-table__td').length, 4, 'should render 4 cells at the beginning (by element)');
  assert.equal(this.$('.ui-table__tr').data('$E').get('childCellList.length'), 4, 'should render 4 cells at the beginning (by component)');

  this.set('cells', [ { show: true }, { show: false }, { show: true }, { show: true } ]);

  assert.equal(this.$('.ui-table__td').length, 3, 'should render 3 cells now (by element)');
  assert.equal(this.$('.ui-table__tr').data('$E').get('childCellList.length'), 3, 'should render 3 cells now (by component)');
});
