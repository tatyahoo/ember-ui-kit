import Ember from 'ember';

/**
 * @public
 * @module ui
 * @class DraggableComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  classNames: 'ui-draggable',

  /**
   * options hash for [jQuery UI draggable](http://api.jqueryui.com/draggable/)
   *
   * @attribute options
   * @default null
   * @type object
   */
  options: null,

  didRender() {
    this._super(...arguments);

    this.$().draggable(Object.assign({}, this.get('options')));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().draggable('destroy');
  }
});
