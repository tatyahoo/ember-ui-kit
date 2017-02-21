import Ember from 'ember';

import { Validatable } from 'ember-ui-kit/helpers/validate';

/**
 * @module input
 * @class in-text
 * @public
 */
export default Ember.Component.extend({
  tagName: 'input',
  classNames: 'in-text',
  attributeBindings: 'valueNormalized:value',

  // attrs {
  value: null,
  // attrs }

  isValueValidatable: Ember.computed('value', function() {
    return this.get('value') instanceof Validatable;
  }).readOnly(),

  valueNormalized: Ember.computed('isValueValidatable', 'value', function() {
    if (this.get('isValueValidatable')) {
      return this.get('value.value');
    }

    return this.get('value');
  }).readOnly(),

  willInsertElement() {
    this._super(...arguments);

    this.$().on('input change', Ember.run.bind(this, function(evt) {
      let value = this.attrs.value;

      if (this.get('isValueValidatable')) {
        value = value.value;
      }

      value.update(evt.target.value);
    }));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().off('input change');
  }
}).reopenClass({
  positionalParams: ['value']
});
