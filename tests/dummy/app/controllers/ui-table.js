import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['mode'],

  mode: 'fixed',

  model: Ember.computed(function() {
    let base = [
      {
        firstName: 'Ming',
        lastName: 'Liu',
        nickName: 'Victor',
        age: 30
      },
      {
        firstName: 'Lei',
        lastName: 'Chen',
        nickName: 'Jane',
        age: 28
      },
      {
        firstName: 'Link',
        lastName: 'Liu',
        nickName: 'Lincoln',
        age: 0
      }
    ];

    base = [].concat(base, base, base, base, base);
    base = [].concat(base, base, base, base, base);
    base = [].concat(base, base, base, base, base);
    base = [].concat(base, base);

    return Ember.A(base);
  }).readOnly()
});
