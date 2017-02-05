import Ember from 'ember';
import layout from '../templates/components/ui-resizable';

export default Ember.Component.extend({
  classNames: 'ui-resizable',
  layout,

  // attrs {
  options: null,
  // attrs }

  didRender() {
    this._super(...arguments);

    this.$().resizable(Ember.assign({}, this.get('options')));
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().resizable('destroy');
  }
});
