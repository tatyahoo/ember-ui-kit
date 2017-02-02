import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  model() {
    return this.get('ajax').request('/users').then(resp => {
      return resp.data;
    });
  }
});
