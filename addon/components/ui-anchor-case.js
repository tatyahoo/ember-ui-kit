import Ember from 'ember';
import layout from '../templates/components/ui-anchor-case';

export default Ember.Component.extend({
  classNames: 'ui-anchor-case',
  layout,

  /**
   * @private
   * @attribute switch
   */
  switch: null,

  /**
   * @private
   * @attribute behavior
   */
  behavior: 'smooth',

  /**
   * @private
   * @attribute block
   */
  block: 'start',

  /**
   * @public
   * @attribute case
   */
  case: null,

  match: Ember.computed('switch', 'case', function() {
    return this.get('switch') === this.get('case');
  }).readOnly(),

  didRender() {
    this._super(...arguments);

    if (this.get('match')) {
      Ember.run.schedule('afterRender', this, 'scrollIntoView');
    }
  },

  // TODO smooth scroll
  scrollIntoView() {
    if (Ember.testing) {
      this.element.scrollIntoView();
    }
    else {
      this.element.scrollIntoView(this.getProperties('block', 'behavior'));
    }
  }

}).reopenClass({
  positionalParams: ['case']
});
