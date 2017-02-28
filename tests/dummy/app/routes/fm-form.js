import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('user', {
      name: 'Link',
      ssn: 'XXX-XX-XXXX',
      age: 0
    });
  }
});
