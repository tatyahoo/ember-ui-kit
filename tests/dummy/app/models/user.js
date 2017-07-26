import DS from 'ember-data';

import { validator, buildValidations } from 'ember-cp-validations';

const Validation = buildValidations({
  name: {
    description: 'Name',
    validators: [ validator('presence', true) ]
  }
});

export default DS.Model.extend(Validation, {
  name: DS.attr('string'),
  ssn: DS.attr('string'),
  age: DS.attr('number'),

  posts: DS.hasMany('post')
});
