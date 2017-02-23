import Ember from 'ember';
import layout from '../templates/components/fm-field';

import { Validatable } from 'ember-ui-kit/helpers/validate';

import Composable from '../mixins/composable';

import MS from '../utils/microstate';

/**
 * @module form
 * @class fm-field
 * @public
 */
export default Ember.Component.extend(Composable, {
  componentRegistrationName: 'field',
  tagName: 'label',
  classNames: 'fm-field',
  attributeBindings: 'modelAttribute:data-model-attribute',
  layout,

  // attrs {
  model: null,
  // attrs }

  modelValue: Ember.computed('isModelValidatable', 'model.value', function() {
    if (this.get('isModelValidatable')) {
      return this.get('model.value');
    }

    return this.get('model');
  }),

  modelAttribute: Ember.computed('isModelValidatable', 'model.results.attribute', function() {
    if (this.get('isModelValidatable')) {
      return this.get('model.results.attribute');
    }

    return null;
  }).readOnly(),

  modelValidation: Ember.computed(function() {
    if (this.get('isModelValidatable')) {
      return this.get('model.results');
    }

    return null;
  }).readOnly(),

  isRequired: Ember.computed('isModelValidatable', 'model.results.options.presence', function() {
    return Boolean(this.get('isModelValidatable') && this.get('model.results.options.presence'));
  }).readOnly(),

  isModelValidatable: Ember.computed('model', function() {
    return this.get('model') instanceof Validatable;
  }).readOnly(),

  actions: {
    modelValueDidChange(newValue) {
      if (this.get('isModelValidatable')) {
        this.get('model').update(newValue);
      }
      else {
        MS.set(this, 'model', newValue);
      }
    }
  }
}).reopenClass({
  positionalParams: ['model']
});
