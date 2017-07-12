import Ember from 'ember';
import layout from '../templates/components/ui-component';

/**
 * Helper component to aid in the composition of components
 *
 * @private
 * @class ComponentComponent
 */
export default Ember.Component.extend({
  classNames: 'ui-component',
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
