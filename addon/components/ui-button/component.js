import Ember from 'ember';
import layout from './template';

import { sendEventAction } from 'ember-ui-kit/utils/ddau';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: 'ui-button',
  classNameBindings: [
    'isFocused:ui-button--focus',
    'isBlurred:ui-button--blur',
    'disabled:ui-button--disabled:ui-button--enabled'
  ],
  attributeBindings: 'disabled',
  layout,

  /**
   * @attribute label
   */
  label: null,

  /**
   * @attribute value
   */
  value: Ember.computed.oneWay('label'),

  /**
   * @attribute value
   */
  disabled: null,

  isFocused: false,
  isBlurred: true,

  didRender() {
    this._super(...arguments);

    this.element.value = this.get('value');
  },

  focusIn() {
    this._super(...arguments);

    this.set('isFocused', true);
    this.set('isBlurred', false);

    sendEventAction(this, 'on-focus-in', 'value', this.get('value'));
  },

  focusOut() {
    this._super(...arguments);

    this.set('isFocused', false);
    this.set('isBlurred', true);

    sendEventAction(this, 'on-focus-out', 'value', this.get('value'));
  },

  click() {
    sendEventAction(this, 'on-click', 'value', this.get('value'));
  }
}).reopenClass({
  positionalParams: ['label', 'value']
});
