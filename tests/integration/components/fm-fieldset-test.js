import { moduleForComponent, test } from 'ember-qunit';
import { validator, buildValidations } from 'ember-cp-validations';
import hbs from 'htmlbars-inline-precompile';

import Ember from 'ember';
import DS from 'ember-data';
import Microstates from 'ember-microstates/initializers/microstates';

moduleForComponent('fm-fieldset', 'Integration | Component | fm-fieldset', {
  integration: true
});

test('it renders', function(assert) {
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

  this.set('model', Ember.run(this.store, this.store.createRecord, 'user', {
    name: null,
    ssn: null
  }));

  this.render(hbs`
    {{#fm-form model}}
      {{#fm-fieldset}}
      {{/fm-fieldset}}
      {{#fm-fieldset}}
      {{/fm-fieldset}}
    {{/fm-form}}
  `);

    assert.equal(this.$('.fm-form').length, 1, 'should render 1 form');
    assert.equal(this.$('.fm-fieldset').length, 2, `should render 2 field set`);
});
