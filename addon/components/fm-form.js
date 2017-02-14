import Ember from 'ember';
import layout from '../templates/components/fm-form';

function collect(object) {
  let properties = [];
  let ctor = object.constructor;

  (ctor.eachAttribute || ctor.eachComputedProperty).call(ctor, key => {
    properties.push(key);
  });

  return properties;
}

export default Ember.Component.extend({
  classNames: 'fm-form',
  layout,

  // attrs {
  model: null,
  // attrs }

  validatedAttributes: Ember.computed('model.validations', function() {
    let model = this.get('model');
    let validations = model.get('validations');

    return [].concat(collect(model), collect(validations.get('attrs')))
      .sort()
      .reduce((accum, key) => {
        if (key === accum[0]) {
          return accum;
        }

        return [].concat(key, accum);
      }, []);
  }).readOnly(),

  validatedAttributesHash: Ember.computed('model', function() {
    return Ember.Object.create({});
  }).readOnly(),

  actions: {
    registerField(key, component) {
      this.set(`validatedAttributesHash.${key}`, component);
    }
  }

}).reopenClass({
  positionalParams: ['model']
});
