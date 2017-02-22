import Ember from 'ember';
import layout from '../templates/components/in-toggle';

import MS from '../utils/microstate';

/**
 * `{{in-toggle}}` is a simple input component that respond
 * to click to toggle. The implementation does not provide
 * specific styling. You are free style it in anyway you like:
 * button, switch, or checkbox.
 *
 * @public
 * @module input
 * @class in-toggle
 */
export default Ember.Component.extend({
  classNames: 'in-toggle',
  classNameBindings: 'valueNormalized:in-toggle--on:in-toggle--off',
  attributeBindings: 'tabindex',
  layout,

  // attrs {
  value: null,
  tabindex: 0,
  // attrs }

  valueNormalized: Ember.computed('value', function() {
    return this.get('value').valueOf();
  }).readOnly(),

  click() {
    MS.toggle(this, 'value');
  }
}).reopenClass({
  positionalParams: ['value']
});
