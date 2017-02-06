import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-table', 'Integration | Component | ui-table', {
  integration: true
});

test('it renders simple table', function(assert) {
  this.set('data', Array.from({ length: 20 }).fill({
    id: 0,
    firstName: 'Mini',
    lastName: 'Me',
    age: 0
  }));

  this.render(hbs`
    <style>
      .ui-table {
        width: 640px;
        max-height: 480px;
      }

      .ui-table__thead,
      .ui-table__tbody  {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        padding: 0 15px;
      }
    </style>

    {{#ui-table as |t|}}
      {{#t.head as |t|}}
        {{#t.h}}ID{{/t.h}}
        {{#t.h}}Age{{/t.h}}
        {{#t.h}}
          <div>Name</div>
          {{#t.h}}First Name{{/t.h}}
          {{#t.h}}Last Name{{/t.h}}
        {{/t.h}}
      {{/t.head}}
      {{#t.body as |t|}}
        {{#each data as |datum|}}
          {{#t.r as |t|}}
            {{#t.d}}{{datum.id}}{{/t.d}}
            {{#t.d}}{{datum.age}}{{/t.d}}
            {{#t.d}}{{datum.firstName}}{{/t.d}}
            {{#t.d}}{{datum.lastName}}{{/t.d}}
          {{/t.r}}
        {{/each}}
      {{/t.body}}
    {{/ui-table}}
  `);

  let table = this.$('.ui-table').data('$E');
  let thead = table.get('thead');
  let leaves = thead.get('childHeaderLeafList');
  let tbody = table.get('tbody');

  assert.equal(thead.get('childHeaderList.length'), 3, 'should registered 3 th');
  assert.equal(thead.get('childHeaderLeafList.length'), 4, 'should registered 4 leaf th');

  this.$('.ui-table__th--branch').each(function(index, th) {
    let width = parseFloat(getComputedStyle(th).getPropertyValue('width'));

    assert.equal(width, 300, `should size branch th[${index}] to 300`);
  });

  leaves.forEach((leaf, index) => {
    let width = parseFloat(getComputedStyle(leaf.element).getPropertyValue('width'));

    assert.equal(width, 150, `should size leaf th[${index}] to 150`);
  });

  tbody.$('.ui-table__td').each(function(index) {
    let width = parseFloat(getComputedStyle(this).getPropertyValue('width'));

    assert.equal(width, 150, `should size td[${index}] to 150`);
  });
});

test('it renders frozen column table', function(assert) {
  this.set('data', Array.from({ length: 20 }).fill({
    id: 0,
    firstName: 'Mini',
    lastName: 'Me',
    age: 0
  }));

  this.render(hbs`
    <style>
      .ui-table {
        width: 640px;
        height: 480px;
      }

      .ui-table__thead,
      .ui-table__tbody  {
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        padding: 0 20px;
      }

      .ui-table__froze {
        border-right: 5px solid gray;
      }

      .ui-table__th,
      .ui-table__td {
        padding: 5px;
      }

      .ui-table__th .ui-table__th {
        position: relative;
        left: -5px;
      }

    </style>

    {{#ui-table as |t|}}
      {{#t.head as |t|}}
        {{#t.h frozen=true}}ID{{/t.h}}
        {{#t.h}}Age{{/t.h}}
        {{#t.h}}
          <div>Name</div>
          {{#t.h}}First Name{{/t.h}}
          {{#t.h}}Last Name{{/t.h}}
        {{/t.h}}
      {{/t.head}}
      {{#t.body as |t|}}
        {{#each data as |datum|}}
          {{#t.r as |t|}}
            {{#t.d}}{{datum.id}}{{/t.d}}
            {{#t.d}}{{datum.age}}{{/t.d}}
            {{#t.d}}{{datum.firstName}}{{/t.d}}
            {{#t.d}}{{datum.lastName}}{{/t.d}}
          {{/t.r}}
        {{/each}}
      {{/t.body}}
    {{/ui-table}}
  `);

  let table = this.$('.ui-table').data('$E');
  let thead = table.get('thead');
  let leaves = thead.get('childHeaderLeafList');

  assert.equal(thead.get('childHeaderList.length'), 3, 'should registered 3 th');
  assert.equal(thead.get('childHeaderLeafList.length'), 4, 'should registered 4 leaf th');

  assert.equal(this.$('.ui-table__froze .ui-table__th').length, 1, 'should have 1 frozen header');
  assert.equal(this.$('.ui-table__unfroze .ui-table__th').length, 4, 'should have 4 unfrozen headers');

  leaves.forEach((leaf, index) => {
    let width = parseFloat(getComputedStyle(leaf.element).getPropertyValue('width'));

    assert.equal(width, 143.75, `should size th[${index}] to 143.75`);
  });

  let froze = this.$('.ui-table__froze').toArray();
  let unfroze = this.$('.ui-table__unfroze').toArray();

  froze.map(getComputedStyle).forEach(css => {
    assert.equal(parseFloat(css.getPropertyValue('left')), 20, 'should froze left 20');
    assert.equal(parseFloat(css.getPropertyValue('width')), 143.75, 'should froze width 143.75');
  });

  unfroze.map(getComputedStyle).forEach(css => {
    assert.equal(parseFloat(css.getPropertyValue('left')), 168.75, 'should unfroze width 168.75');
    assert.equal(parseFloat(css.getPropertyValue('width')), 431.25, 'should unfroze width 431.25');
  });

  assert.equal(parseFloat(getComputedStyle(this.$('.ui-table__unfroze .ui-scrollable__scroller').get(0)).getPropertyValue('width')), 431.25, 'should scroller width 431.25');
});