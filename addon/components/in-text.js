import Ember from 'ember';

import MS from '../utils/microstate';

/**
 * @public
 * @module input
 * @class TextInputComponent
 * @namespace UI
 */
export default Ember.Component.extend({
  tagName: 'input',
  classNames: 'in-text',

  // attrs {
  value: null,
  tabindex: 0,
  // attrs }

  willInsertElement() {
    this._super(...arguments);

    this.$().on('input change', Ember.run.bind(this, function(evt) {
      MS.set(this, 'value', evt.target.value);
    }));
  },

  didRender() {
    this._super(...arguments);

    this.$().val(this.get('value'));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().off('input change');
  }
}).reopenClass({
  positionalParams: ['value']
});
