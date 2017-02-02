import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    mode: {
      replace: true
    }
  },

  beforeModel(transition) {
    let qp = transition.queryParams;

    if (qp.mode) {
      return;
    }

    transition.abort();

    this.replaceWith(this.routeName, {
      queryParams: {
        mode: 'fixed'
      }
    });
  }
});
