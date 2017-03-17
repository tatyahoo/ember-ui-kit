import { moduleForComponent, test } from 'ember-qunit';
import { validator, buildValidations } from 'ember-cp-validations';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';
import DS from 'ember-data';

import Microstates from 'ember-microstates/initializers/microstates';

moduleForComponent('fm-form', 'Integration | Component | fm-form', {
  integration: true
});

// TODO need a test case to change model type, ensure validatedAttributes are changed correctly
// TODO need a test case for complex bidirectional relationship validation
// TODO integration with table
// TODO table form rollback through ember-time-machine

test('it convert model to fm-field collection that is bindable', function(assert) {
  Microstates.initialize(this);

  this.register('model:user', DS.Model.extend({
    name: DS.attr('string'),
    ssn: DS.attr('number')
  }).reopen(buildValidations({
    name: {
      description: 'Name',
      validators: [ validator('presence', true) ]
    }
  })));

  this.inject.service('store');

  [1, 2].forEach(index => {
    this.set('model', null);

    this.render(hbs`
      {{#fm-form model as |attr|}}
        {{#attr.name as |in|}}
          {{in.text}}
        {{/attr.name}}
        {{#attr.ssn as |in|}}
          {{in.text}}
        {{/attr.ssn}}
      {{/fm-form}}
    `);

    assert.equal(this.$('.fm-form').length, 1, `loop ${index} form should be ok with null model`);
    assert.equal(this.$('.fm-form').children().length, 2, `loop ${index} form should be ok with null model`);

    this.set('model', Ember.run(this.store, this.store.createRecord, 'user', {
      name: null,
      ssn: null
    }));

    assert.equal(this.$('.fm-form').length, 1, `loop ${index} should render 1 form`);
    assert.equal(this.$('.fm-field').length, 2, `loop ${index} should render 2 fields`);
  });

  let name = this.$('.fm-field[data-model-attribute="name"]');
  let ssn = this.$('.fm-field:not([data-model-attribute="name"])');

  assert.equal(name.find('.in-text').length, 1, 'should render name field as text field');
  assert.equal(name.find('.in-text').val(), '', 'should have name field be empty');
  assert.equal(name.find('.fm-field__validation-messages li').length, 1, 'should show name field validation');

  assert.equal(ssn.find('.in-text').length, 1, 'should render ssn field as text field');
  assert.equal(ssn.find('.fm-field__validation-messages li').length, 0, 'should not show ssn field validation');

  name.find('.in-text').val('Link').change();

  assert.equal(name.find('.in-text').val(), 'Link', 'should have updated name field to Link');
  assert.equal(name.find('.fm-field__validation-messages li').length, 0, 'should name field no longer be invalid');

  assert.equal(this.get('model.name'), 'Link', 'should have updated model name through field');
});

test('it should not submit form with button', function(assert) {
  assert.expect(0);

  this.render(hbs`
    {{#fm-form model as |attr|}}
      <button id="button">BUTTON</button>
      <input id="input" type="submit" value="INPUT">
    {{/fm-form}}
  `);

  this.$('#button').click();
  this.$('#input').click();
});

//test('it allows model to have validatable relationship', function(assert) {
//  this.register('model:user', DS.Model.extend({
//    name: DS.attr('string'),
//    ssn: DS.attr('number'),
//
//    favorite: DS.belongsTo('user'),
//    posts: DS.hasMany('post')
//  }).reopen(buildValidations({
//    name: {
//      description: 'Name',
//      validators: [ validator('presence', true) ]
//    }
//  })));
//
//  this.register('model:post', DS.Model.extend({
//    title: DS.attr('string'),
//    content: DS.attr('string'),
//
//    authors: DS.hasMany('user')
//  }).reopen(buildValidations({
//    title: {
//      description: 'Title',
//      validators: [ validator('presence', true) ]
//    },
//
//    authors: validator('has-many')
//  })));
//
//  this.inject.service('store');
//
//  Ember.run(this.store, this.store.push, {
//    data: [
//      {
//        id: 1,
//        type: 'user',
//        attributes: {
//          name: 'Link',
//          ssn: 'XXX-XX-XXXX'
//        },
//        relationships: {
//          posts: {
//            data: [
//              {
//                id: 1,
//                type: 'post'
//              }
//            ]
//          }
//        }
//      },
//      {
//        id: 2,
//        type: 'user',
//        attributes: {
//          name: 'Zelda',
//          ssn: 'XXX-XX-XXXX'
//        },
//        relationships: {
//          favorite: {
//            data: {
//              id: 1,
//              type: 'user'
//            }
//          },
//          posts: {
//            data: [
//              {
//                id: 1,
//                type: 'post'
//              }
//            ]
//          }
//        }
//      },
//      {
//        id: 1,
//        type: 'post',
//        attributes: {
//          title: 'Master the sword',
//        },
//        relationships: {
//          authors: {
//            data: [
//              {
//                id: 1,
//                type: 'user'
//              },
//              {
//                id: 2,
//                type: 'user'
//              }
//            ]
//          }
//        }
//      }
//    ]
//  });
//
//  let post = this.store.peekRecord('post', 1);
//  let authors = post.get('authors');
//
//  assert.equal(authors.objectAt(0).get('name'), 'Link', 'should have relationship setup: post.authors.0');
//  assert.equal(authors.objectAt(1).get('name'), 'Zelda', 'should have relationship setup: post.authors.1');
//
//  this.set('model', post);
//
//  // TODO
//  // How many ways can a model's relationship be used?
//  //
//  // # belongsTo
//  // - Single select
//  // - Checkbox/switch
//  // - Nested form via {{fm-form}}
//  //
//  // # hasMany
//  // - Multi select
//  // - tag list
//  // - A table or list to hold the content, validate list empty, validate each item in table/list
//  //
//  this.render(hbs`
//    {{#fm-form model as |attribute relationship|}}
//      {{#attribute.title as |in|}}
//        {{in.text}}
//        {{in.switch}}
//        {{in.checkbox}}
//      {{/attribute.title}}
//
//      {{#relationship.authors as |in|}}
//        {{in.select}}
//        {{in.tag-list}}
//        {{in.button-group}}
//        {{in.radio-button-group}}
//
//        {{in.table}}
//
//        {{#ui-table as |t|}}
//          {{t.head 83 83 83}}
//          {{#t.body as |t|}}
//            {{#t.r}}
//            {{/t.r}}
//          {{/t.body}}
//        {{/ui-table}}
//      {{/relationship.authors}}
//    {{/fm-form}}
//  `);
//});

test('it integrates with table to allow table rows to be form', function(assert) {
  Microstates.initialize(this);

  this.register('model:user', DS.Model.extend({
    name: DS.attr('string'),
    hairColor: DS.attr('string')
  }).reopen(buildValidations({
    name: {
      description: 'Name',
      validators: [ validator('presence', true) ]
    }
  })));

  this.inject.service('store');

  this.set('data', Ember.run(this.store, this.store.push, {
    data: [
      {
        id: 1,
        type: 'user',
        attributes: {
          name: 'Link',
          hairColor: 'blond'
        }
      },
      {
        id: 2,
        type: 'user',
        attributes: {
          name: 'Zelda',
          hairColor: 'brown'
        }
      }
    ]
  }));

  this.render(hbs`
    <style>
      .ui-table {
        width: 640px;
        max-height: 240px;
      }
    </style>

    {{#ui-table as |t|}}
      {{#t.head as |t|}}
        {{#t.h}}Name{{/t.h}}
        {{#t.h}}Hair Color{{/t.h}}
      {{/t.head}}
      {{#t.body as |t|}}
        {{#each data as |datum|}}
          {{#t.r as |t|}}
            {{#fm-form datum as |attribute|}}
              {{#t.d}}
                {{#attribute.name as |in|}}
                  {{in.text}}
                {{/attribute.name}}
              {{/t.d}}
              {{#t.d}}
                {{#attribute.hairColor as |in|}}
                  {{in.text}}
                {{/attribute.hairColor}}
              {{/t.d}}
            {{/fm-form}}
          {{/t.r}}
        {{/each}}
      {{/t.body}}
    {{/ui-table}}
  `);

  let link = this.$('.ui-table__unfroze .ui-table__tr:first');
  let zelda = this.$('.ui-table__unfroze .ui-table__tr:last');

  assert.equal(link.find('.ui-table__td:first .in-text').val(), 'Link', 'Table row form should have value set: link');
  assert.equal(zelda.find('.ui-table__td:first .in-text').val(), 'Zelda', 'Table row form should have value set: zelda');

  link.find('.ui-table__td:first .in-text').val('Zing').change();

  assert.equal(this.get('data.0.name'), 'Zing', 'changing field value should set model');
});
