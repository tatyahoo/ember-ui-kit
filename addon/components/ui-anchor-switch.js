import Ember from 'ember';
import layout from '../templates/components/ui-anchor-switch';

export default Ember.Component.extend({
  classNames: 'ui-anchor-switch',
  layout,

  /**
   * @public
   * @attribute switch
   */
  switch: null,

  /**
   * @public
   * @attribute behavior
   */
  behavior: 'smooth',

  /**
   * @public
   * @attribute block
   */
  block: 'start',

  didInsertElement() {
    this._super(...arguments);

    this.$().on('scroll', evt => {
      console.log(arguments);
    })
  }

}).reopenClass({
  positionalParams: ['switch']
});
