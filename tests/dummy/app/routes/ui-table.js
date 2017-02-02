import Ember from 'ember';

export default Ember.Route.extend({
  ajax: Ember.inject.service(),

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
  },

  model() {
    return this.get('ajax').request('/users').then(response => {
      return response.data;
    });
  }
});
