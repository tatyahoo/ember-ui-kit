import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['mode'],

  mode: null,

  actions: {
    mode(item) {
      this.set('mode', item.value);
    }
  }
});
