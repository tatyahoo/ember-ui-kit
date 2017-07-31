import Ember from 'ember';
import layout from './template';
import Input from '../in-base';

/**
 * @public
 * @module input
 * @class TextInputComponent
 * @extends UI.BaseInputComponent
 * @namespace UI
 */
export default Input.extend({
  classNames: 'in-text',
  classNameBindings: [
    'isFocused:in-text--focus',
    'isBlurred:in-text--blur',
    'disabled:in-text--disabled:in-text--enabled'
  ],
  attributeBindings: 'title',
  layout,

  /**
   * @attribute placeholder
   */
  placeholder: null,

  /**
   * @attribute autocomplete
   */
  autocomplete: 'off',

  /**
   * @attribute autofocus
   */
  autofocus: false,

  /**
   * @attribute disabled
   */
  disabled: false,

  /**
   * @protected
   * @property inputElement
   */
  inputElement: Ember.computed(function() {
    return this.element.querySelector('.in-text__infix');
  }).readOnly(),

  didRender() {
    this._super(...arguments);

    this.set('inputElement.value', this.get('value') || '');
    this.set('inputElement.autofocus', this.get('autofocus'));
    this.set('inputElement.disabled', this.get('disabled'));
  },

  /**
   * @event on-input
   */
  input() {
    this._super(...arguments);

    this.sendEventAction('on-input');
  },

  /**
   * @event on-enter-key
   */
  /**
   * @event on-escape-key
   */
  /**
   * @event on-backspace-key
   */
  keyUp(evt) {
    this._super(...arguments);

    switch (evt.key) {
      case 'Enter': this.sendEventAction('on-enter-key'); break;
      case 'Escape': this.sendEventAction('on-escape-key'); break;
      case 'Backspace': this.sendEventAction('on-backspace-key'); break;
    }
  },

  sendEventAction(actionName) {
    return this._super(actionName, this.get('inputElement.value'));
  }
});
