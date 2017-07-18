import Ember from 'ember';
import layout from './template';

/**
 * Helper component to aid in the composition of components
 *
 * @private
 * @class ComponentComponent
 */
export default Ember.Component.extend({
  classNames: 'x-component',
  layout,

  /**
   * @attribute value
   */
  value: null,

  isSimpleValue: Ember.computed('value', function() {
    return typeof this.get('value') === 'string';
  }).readOnly()
}).reopenClass({
  positionalParams: ['value']
});
