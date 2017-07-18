import Ember from 'ember';
import layout from './template';

import Input from '../in-base';

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

  /**
   * @attribute disabled
   */
  disabled: false,

  /**
   * @protected
   * @property inputElement
   */
  inputElement: Ember.computed(function() {
    return this.element.querySelector('.in-toggle__infix');
  }).readOnly(),

  didRender() {
    this._super(...arguments);

    this.set('inputElement.checked', this.get('value'));
    this.set('inputElement.disabled', this.get('disabled'));
  },

  sendEventAction(actionName) {
    return this._super(actionName, this.get('inputElement.checked'));
  }
}).reopenClass({
  positionalParams: ['value']
});
