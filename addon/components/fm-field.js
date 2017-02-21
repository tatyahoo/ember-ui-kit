import Ember from 'ember';
import layout from '../templates/components/fm-field';

import { Validatable } from 'ember-ui-kit/helpers/validate';

/**
 * @module form
 * @class fm-field
 * @public
 */
export default Ember.Component.extend({
  tagName: 'label',
  classNames: 'fm-field',
  attributeBindings: 'modelAttribute:data-model-attribute',
  layout,

  // attrs {
  model: null,
  // attrs }

  modelAttribute: Ember.computed('isModelValidatable', 'model.results.attribute', function() {
    if (this.get('isModelValidatable')) {
      return this.get('model.results.attribute');
    }

    return null;
  }).readOnly(),

  isModelValidatable: Ember.computed('model', function() {
    return this.get('model') instanceof Validatable;
  }).readOnly()

}).reopenClass({
  positionalParams: ['model']
});
