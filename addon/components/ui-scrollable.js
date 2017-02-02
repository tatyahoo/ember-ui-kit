import Ember from 'ember';
import layout from '../templates/components/ui-scrollable';

export default Ember.Component.extend({
  classNames: 'ui-scrollable',
  layout,

  didInsertElement() {
    this._super(...arguments);

    this.$().perfectScrollbar();
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().perfectScrollbar('destroy');
  }
});
