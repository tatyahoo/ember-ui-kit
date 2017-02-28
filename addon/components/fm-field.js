import Ember from 'ember';
import layout from '../templates/components/fm-field';

import Composable from '../mixins/composable';

/**
 * @module form
 * @class fm-field
 * @public
 */
export default Ember.Component.extend(Composable, {
  componentRegistrationName: 'field',
  tagName: 'label',
  classNames: 'fm-field',
  classNameBindings: [
    'validation.isValid:fm-field--valid:',
    'validation.isInvalid:fm-field--invalid'
  ],
  attributeBindings: 'valuePath:data-model-attribute',
  layout,

  // attrs {
  value: null,
  validPath: null,
  validation: null,
  // attrs }
});
