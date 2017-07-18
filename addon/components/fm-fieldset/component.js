import Ember from 'ember';

import { observerOnceIn } from 'ember-ui-kit/utils/run';

/**
 * @private
 * @module form
 * @class FormFieldsetComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  tagName: 'fieldset',
  classNames: 'fm-fieldset',

  // attrs {
  disabled: false,
  // attrs }

  disabledChange: observerOnceIn('render', 'disabled', function() {
    this.$('input').prop('disabled', this.get('disabled'));
  })
});
