import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['mode'],

  application: Ember.inject.controller(),

  mode: null,

  actions: {
    mode(item) {
      this.set('mode', item.value);
    }
  }
});
