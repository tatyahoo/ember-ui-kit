import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  queryParams: [ 'preload' ],

  start: 0,
  end: 0,
  preload: 5,

  model: Ember.computed(function() {
    let array = Ember.A();

    array.set('isFulfilled', false);
    array.set('isPending', true);

    Ember.run.next(this, this.addData, this.get('preload'));

    return array;
  }).readOnly(),

  addData(count) {
    let start = this.get('end');
    let model = this.get('model');

    return this.get('ajax')
      .request(`/users?start=${start}&end=${start + count}`)
      .then(results => {
        model.pushObjects(results);
        model.set('isFulfilled', true);
        model.set('isPending', false);
        this.incrementProperty('end', count);
      });
  }
});
