import Ember from 'ember';
import layout from './template';

/**
 * `ui-backdrop` is a simple component to put a mask
 * over the screen. Use with `ui-position` to create
 * modal.
 *
 * @public
 * @module ui
 * @namespace UI
 * @class BackdropComponent
 */
export default Ember.Component.extend({
  classNames: 'ui-backdrop',
  layout,

  click(evt) {
    if (evt.target === this.element) {
      this.sendAction('on-click');
    }
  }
});
