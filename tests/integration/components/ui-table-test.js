import { moduleForComponent, test } from 'ember-qunit';
import Microstates from 'ember-microstates/initializers/microstates';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';

moduleForComponent('ui-table', 'Integration | Component | ui-table', {
  integration: true
});

test('it renders simple table', function(assert) {
  let clicks = [];

  Microstates.initialize(this);

  this.set('data', Array.from({ length: 40 }).fill({
    id: 0,
    firstName: 'Mini',
    lastName: 'Me',
    age: 0
  }));

  this.set('click', evt => {
    clicks.push(evt);
  });

  this.render(hbs`
    <style>
      .ui-table {
        width: 640px;
        max-height: 240px;
      }

      .ui-table__thead,
      .ui-table__tbody  {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        padding: 0 15px;
      }
    </style>

    {{let cursor=(Number 0)}}

    <div class="cursor">{{cursor}}</div>

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
      {{#t.body cursor=cursor as |t|}}
        {{#each data as |datum|}}
          {{#t.r click=(action click)  as |t|}}
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

    assert.equal(width, 280, `should size branch th[${index}] to 280`);
  });

  leaves.forEach((leaf, index) => {
    let width = parseFloat(getComputedStyle(leaf.element).getPropertyValue('width'));

    assert.equal(width, 140, `should size leaf th[${index}] to 140`);
  });

  tbody.$('.ui-table__td').each(function(index) {
    let width = parseFloat(getComputedStyle(this).getPropertyValue('width'));

    assert.equal(width, 140, `should size td[${index}] to 140`);
  });

  assert.equal(this.$('.cursor').text(), '0', 'should initial cursor position at 0');

  tbody.$('.ui-table__unfroze.ui-scrollable').data('$E').scrollTop(100);

  assert.equal(this.$('.cursor').text(), '5', 'should scroll to 5 with scrollTop 100');

  let froze = tbody.$('.ui-table__froze .ui-table__tr');
  let unfroze = tbody.$('.ui-table__unfroze .ui-table__tr');

  this.get('data').forEach((datum, index) => {
    froze.eq(index).trigger('mouseenter');

    assert.ok(froze.eq(index).hasClass('ui-table__tr--hover'));
    assert.ok(unfroze.eq(index).hasClass('ui-table__tr--hover'));

    froze.eq(index).trigger('mouseleave');

    assert.ok(!froze.eq(index).hasClass('ui-table__tr--hover'));
    assert.ok(!unfroze.eq(index).hasClass('ui-table__tr--hover'));

    unfroze.eq(index).trigger('mouseenter');

    assert.ok(froze.eq(index).hasClass('ui-table__tr--hover'));
    assert.ok(unfroze.eq(index).hasClass('ui-table__tr--hover'));

    unfroze.eq(index).trigger('mouseleave');

    assert.ok(!froze.eq(index).hasClass('ui-table__tr--hover'));
    assert.ok(!unfroze.eq(index).hasClass('ui-table__tr--hover'));
  });

  froze.each(function(index, element) {
    Ember.$(element).click();
  });

  unfroze.each(function(index, element) {
    Ember.$(element).click();
  });

  assert.equal(clicks.length, 80, 'should register 80 clicks');
});

test('it renders frozen column table', function(assert) {
  this.set('data', Array.from({ length: 40 }).fill({
    id: 0,
    firstName: 'Mini',
    lastName: 'Me',
    age: 0
  }));

  this.render(hbs`
    <style>
      .ui-table {
        width: 640px;
        height: 240px;
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

    assert.equal(width, 128.75, `should size th[${index}] to 128.75`);
  });

  let froze = this.$('.ui-table__froze').toArray();
  let unfroze = this.$('.ui-table__unfroze').toArray();

  froze.map(getComputedStyle).forEach(css => {
    assert.equal(parseFloat(css.getPropertyValue('width')), 128.75, 'should froze width 128.75');
  });

  unfroze.map(getComputedStyle).forEach(css => {
    assert.equal(parseFloat(css.getPropertyValue('width')), 386.25, 'should unfroze width 386.25');
  });

  assert.equal(parseFloat(getComputedStyle(this.$('.ui-table__unfroze .ui-scrollable__scroller').get(0)).getPropertyValue('width')), 386.25, 'should scroller width 386.25');
});
