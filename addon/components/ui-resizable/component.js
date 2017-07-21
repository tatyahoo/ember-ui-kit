import Ember from 'ember';

/**
 * @public
 * @module ui
 * @class ResizableComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  classNames: 'ui-resizable',

  /**
   * options hash for [jQuery UI resizable](http://api.jqueryui.com/resizable/)
   *
   * @attribute options
   * @default null
   * @type object
   */
  options: null,

  didRender() {
    this._super(...arguments);

    this.$().resizable(Object.assign({}, this.get('options')));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().resizable('destroy');
  }
});
