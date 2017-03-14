import Ember from 'ember';
import layout from '../templates/components/ui-position';

/**
 * @module ui
 * @class ui-position
 * @public
 */
export default Ember.Component.extend({
  classNames: 'ui-position',
  layout,

  /**
   * options hash for [jQuery UI position](http://api.jqueryui.com/position/)
   *
   * @attribute options
   * @default null
   * @type object
   */
  options: null,

  didRender() {
    this._super(...arguments);

    let options = Object.assign({}, this.get('options'));

    options.of = options.of || this.$().parent();

    this.$().position(options);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().position('destroy');
  }
});
