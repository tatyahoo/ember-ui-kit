import Ember from 'ember';

export default Ember.Mixin.create({
  willInsertElement() {
    this._super(...arguments);

    this.$().data('$E', this);
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().removeData('$E');
  }
});
