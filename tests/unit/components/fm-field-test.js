import { moduleForComponent, test } from 'ember-qunit';
import { Validatable } from 'ember-ui-kit/helpers/validate';
import { validator, buildValidations } from 'ember-cp-validations';

import Ember from 'ember';
import Microstates from 'ember-microstates/initializers/microstates';

moduleForComponent('fm-field', 'Unit | Component | fm-field', {
  // Specify the other units that are required for this test
  needs: ['validator:presence'],

  unit: true
});

test('with validation', function(assert) {
  Microstates.initialize(this);

  this.register('model:user', DS.Model.extend(
    buildValidations({
      name: {
        description: 'Name',
        validators: [ validator('presence', true) ]
      }
    }),
    {
      name: null
    }
  ));

  this.inject.service('store');

  let model = Ember.run(this.store, this.store.createRecord, 'user', {
    name: 'Link'
  });
  let component = this.subject({
    model: new Validatable(model.get('name'), {
      results: model.get('validations.attrs.name')
    })
  });

  assert.equal(component.get('modelValue'), model.get('name'), 'validated model should have proxy the value');
  assert.equal(component.get('modelValidation'), model.get('validations.attrs.name'), 'validated model should have proxy the validation');
  assert.equal(component.get('isRequired'), true, 'validated model should have proxy required');
});

test('without validation', function(assert) {
  let component = this.subject({
    model: 'Link'
  });

  assert.equal(component.get('modelValue'), 'Link', 'non validated model should proxy value');
  assert.equal(component.get('modelValidation'), null, 'non validated model should not proxy valiation');
  assert.equal(component.get('isRequired'), false, 'non validated model should not be required');
});
