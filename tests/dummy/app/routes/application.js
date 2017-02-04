import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    addData(count) {
      this.controllerFor(this.routeName).addData(count);
    },

    removeData(count) {
    }
  }
});
