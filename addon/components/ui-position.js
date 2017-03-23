import Ember from 'ember';
import layout from '../templates/components/ui-position';

const WHITE_SPACE_CHUNKER = /\s+/;

const VERTICAL = /^(top|bottom)/;
const HORIZONTAL = /^(left|right)/;

function fix(position) {
  let chunks = position.trim().split(WHITE_SPACE_CHUNKER);

  let [ left, right ] = chunks;

  if (chunks.length > 1 && (VERTICAL.test(left) || HORIZONTAL.test(right))) {
    return chunks.reverse().join(' ');
  }

  return chunks.join(' ');
}

/**
 * `ui-position` is a simple wrapper around
 * [jQuery UI position](http://api.jqueryui.com/position/)
 *
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

  optionsNormalized: Ember.computed('options', function() {
    let options = Object.assign({}, this.get('options'));

    options.of = options.of || this.$().parent();
    options.my = fix(options.my || '');
    options.at = fix(options.at || '');

    return options;
  }).readOnly(),

  didRender() {
    this._super(...arguments);

    this.$().position(this.get('optionsNormalized'));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().position('destroy');
  }
});
