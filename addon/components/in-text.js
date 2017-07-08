import Ember from 'ember';
import layout from '../templates/components/in-text';

function sendAction(component, actionName) {
  let action = component.get(actionName);
  let type = typeof action;
  let oldValue = component.get('value');

  if (typeof action === 'function') {
    let newValue = action(value);

    if (typeof newValue !== 'undefined') {
      component.set('value', newValue);
    }
  }
  else {
    return component.sendAction(actionName, oldValue);
  }
}

/**
 * @public
 * @module input
 * @class TextInputComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  mergedProperties: ['actionDispatcher'],

  tagName: 'label',
  classNames: 'in-text',
  classNameBindings: [
    'isFocused:in-text--focus',
    'isBlurred:in-text--blur'
  ],
  layout,

  /**
   * @attribute value
   */
  value: null,

  /**
   * @private
   * @property isFocused
   */
  isFocused: false,

  /**
   * @private
   * @property isBlurred
   */
  isBlurred: true,

  /**
   * @protected
   * @property inputElement
   */
  inputElement: Ember.computed(function() {
    return this.$('.ember-text-field');
  }).readOnly(),

  /**
   * @protected
   * @property actionDispatcher
   */
  actionDispatcher: {
    change: 'on-change',
    focus: 'on-focus',
    blur: 'on-blur',
    input: 'on-input',
    keyup(evt) {
      switch (evt.key) {
        case 'Enter': return 'on-enter-key';
        case 'Escape': return 'on-escape-key';
      }
    }
  },

  /**
   * @event on-change
   */

  /**
   * @event on-input
   */

  /**
   * @event on-focus
   */

  /**
   * @event on-blur
   */

  /**
   * @event on-enter-key
   */

  /**
   * @event on-escape-key
   */

  attachActionDispatchers() {
    let ns = this.get('elementId');
    let input = this.get('inputElement');

    let dispatcher = this.get('actionDispatcher');

    let events = Object.keys(dispatcher).map(event => `${event}.${ns}`).join(' ');

    input.on(events, evt => {
      let action = dispatcher[evt.type];

      if (typeof action === 'string') {
        sendAction(this, action);
      }
      else {
        let name = action(evt);

        if (typeof name === 'string') {
          sendAction(this, name);
        }
      }
    });
  },

  detachActionDispatchers() {
    let ns = this.get('elementId');
    let input = this.get('inputElement');

    input.off(`.${ns}`);
  },

  didRender() {
    this._super(...arguments);

    this.detachActionDispatchers();
    this.attachActionDispatchers();
  },

  willDestroyElement() {
    this._super(...arguments);

    this.detachActionDispatchers();
  },

  focusIn() {
    this._super(...arguments);

    this.set('isFocused', true);
    this.set('isBlurred', false);
  },

  focusOut() {
    this._super(...arguments);

    this.set('isFocused', false);
    this.set('isBlurred', true);
  }
}).reopenClass({
  positionalParams: ['value']
});
