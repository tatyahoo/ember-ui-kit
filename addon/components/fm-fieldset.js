import Ember from 'ember';
import layout from '../templates/components/fm-fieldset';

import Composable from '../mixins/composable';

import { observerOnceIn } from '../utils/run';

/**
 * @private
 * @module form
 * @class fm-fieldset
 */
export default Ember.Component.extend(Composable, {
  tagName: 'fieldset',
  classNames: 'fm-fieldset',
  layout,

  // attrs {
  disabled: false,
  // attrs }

  disabledChange: observerOnceIn('render', 'disabled', function() {
    this.$('input').prop('disabled', this.get('disabled'));
  })
});
