import DS from 'ember-data';

import { validator, buildValidations } from 'ember-cp-validations';

export default DS.Model.extend(
  buildValidations({
    name: {
      description: 'Name',
      validators: [ validator('presence', true) ]
    }
  }),
  {
    name: DS.attr('string'),
    ssn: DS.attr('string'),
    age: DS.attr('number')
  }
);
