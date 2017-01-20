import Ember from 'ember';

const BufferedArray = Ember.ArrayProxy.extend({
  isBufferedArray: true
});

// addObjects accepts DS.PromiseArray

export default Ember.Controller.extend({
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

    return base;
  }).readOnly(),

  bufferedModel: Ember.computed('model', function() {
    return BufferedArray.create({
      content: this.get('model')
    });
  }).readOnly(),
});
