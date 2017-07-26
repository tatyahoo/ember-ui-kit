import Ember from 'ember';
import layout from './template';

/**
 * @private
 * @module form
 * @class FormFieldComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  tagName: 'label',
  classNames: 'fm-field',
  classNameBindings: [
    'validation.isValid:fm-field--valid',
    'validation.isInvalid:fm-field--invalid'
  ],
  attributeBindings: 'valuePath:data-model-attribute',
  layout,

  // attrs {
  value: null,
  validPath: null,
  validation: null
  // attrs }
});
