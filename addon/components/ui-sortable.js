import Ember from 'ember';
import layout from '../templates/components/ui-sortable';

export default Ember.Component.extend({
  classNames: 'ui-sortable',
  layout,

  // attrs {
  options: null,
  // attrs }

  didRender() {
    this._super(...arguments);

    this.$().sortable(Ember.assign({}, this.get('options')));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().sortable('destroy');
  }
});
