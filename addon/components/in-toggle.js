import Ember from 'ember';
import layout from '../templates/components/in-toggle';

import Input from './in-base';

/**
 * `{{in-toggle}}` is a simple input component that respond
 * to click to toggle. The implementation does not provide
 * specific styling. You are free style it in anyway you like:
 * button, switch, or checkbox.
 *
 * @public
 * @module input
 * @class ToggleInputComponent
 * @namespace UI
 */
export default Input.extend({
  classNames: 'in-toggle',
  classNameBindings: [
    'value:in-toggle--on:in-toggle--off',
    'isFocused:in-toggle--focus',
    'isBlurred:in-toggle--blur'
  ],
  layout,

  /**
   * @public
   * @attribute value
   */
  value: false,

  didRender() {
    this._super(...arguments);

    this.get('inputElement').prop('checked', this.get('value'));
  }

}).reopenClass({
  positionalParams: ['value']
});
