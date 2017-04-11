import Ember from 'ember';
import layout from '../templates/components/ui-sortable';

/**
 * @public
 * @module ui
 * @class SortableComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  classNames: 'ui-sortable',
  layout,

  // attrs {

  /**
   * options hash for [jQuery UI sortable](http://api.jqueryui.com/sortable/)
   *
   * @attribute options
   * @default null
   * @type object
   */
  options: null,

  // attrs }

  didRender() {
    this._super(...arguments);

    this.$().sortable(Object.assign({}, this.get('options')));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().sortable('destroy');
  }
});
