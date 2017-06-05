import Ember from 'ember';
import layout from '../templates/components/ui-td';

export default Ember.Component.extend({
  classNames: 'ui-td',
  layout,

  attributeBindings: [
    'column:data-column-id'
  ],

  /**
   * @attribute {} column
   */
  column: null
});
