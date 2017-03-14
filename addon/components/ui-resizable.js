import Ember from 'ember';
import layout from '../templates/components/ui-resizable';

/**
 * @module ui
 * @class ui-resizable
 * @public
 */
export default Ember.Component.extend({
  classNames: 'ui-resizable',
  layout,

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
