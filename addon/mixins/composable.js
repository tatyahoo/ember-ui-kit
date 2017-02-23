import Ember from 'ember';

export default Ember.Mixin.create({
  up(selector) {
    return Ember.A(this.$().parentsUntil('.ember-application', selector).toArray().map(element => {
      return Ember.$(element).data('$E');
    }));
  },

  down(selector) {
    return Ember.A(this.$().find(selector).toArray().map(element => {
      return Ember.$(element).data('$E');
    }));
  },

  willInsertElement() {
    this._super(...arguments);

    this.$().data('$E', this);
  },

  didInsertElement() {
    this._super(...arguments);

    let name = this.get('componentRegistrationName');

    if (name) {
      this.$().parent().trigger(`register.${name}`, this);
      this.$().parent().trigger('register.all', this);
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    let name = this.get('componentRegistrationName');

    this.$().removeData('$E');

    if (name) {
      this.$().parent().trigger(`unregister.${name}`, this);
      this.$().parent().trigger('unregister.all', this);
    }
  }
});
