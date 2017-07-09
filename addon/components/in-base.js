import Ember from 'ember';

function sendAction(actionName) {
  let action = this.get(actionName);
  let type = typeof action;
  let input = this.get('inputElement')
  let updatedValue = input.is('input[type=checkbox]') ? input.is(':checked') : input.val();

  if (typeof action === 'function') {
    let newValue = action(updatedValue);

    this.set('value', typeof newValue !== 'undefined' ? newValue : updatedValue);
  }
  else {
    return this.sendAction(actionName, updatedValue);
  }
}

/**
 * @protected
 * @module input
 * @class BaseInputComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  mergedProperties: ['actionDispatcher'],

  tagName: 'label',

  actionDispatcher: {
    /**
     * @event on-change
     */
    change: 'on-change',

    /**
     * @event on-focus
     */
    focus: 'on-focus',

    /**
     * @event on-blur
     */
    blur: 'on-blur'
  },

  /**
   * @public
   * @attribute value
   */
  value: null,

  /**
   * @protected
   * @property isFocused
   */
  isFocused: false,

  /**
   * @protected
   * @property isBlurred
   */
  isBlurred: true,

  /**
   * @protected
   * @property inputElement
   */
  inputElement: Ember.computed(function() {
    return this.$('input');
  }).readOnly(),

  attachActionDispatchers() {
    let ns = this.get('elementId');
    let input = this.get('inputElement');

    let dispatcher = this.get('actionDispatcher');

    let events = Object.keys(dispatcher).map(event => `${event}.${ns}`).join(' ');

    input.on(events, evt => {
      let action = dispatcher[evt.type];

      if (typeof action === 'string') {
        Ember.run(this, sendAction, action);
      }
      else {
        let name = action(evt);

        if (typeof name === 'string') {
          Ember.run(this, sendAction, name);
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
