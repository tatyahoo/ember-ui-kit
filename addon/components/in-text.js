import Ember from 'ember';
import layout from '../templates/components/in-text';
import Input from './in-base';

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
    'isBlurred:in-text--blur'
  ],
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
   * @protected
   * @property actionDispatcher
   */
  inputElement: Ember.computed(function() {
    return this.element.querySelector('.in-text__infix');
  }).readOnly(),

  didRender() {
    this._super(...arguments);

    this.set('inputElement.value', this.get('value'));
    this.set('inputElement.autofocus', this.get('autofocus'));
  },

  /**
   * @attribute placeholder
   */
  placeholder: null,

  didRender() {
    this._super(...arguments);

    this.get('inputElement').val(this.get('value'));
  }
});
