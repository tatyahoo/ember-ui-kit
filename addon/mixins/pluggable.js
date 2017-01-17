import Ember from 'ember';

//
// @private
//
// Read from #plugins hash and excute plugin lifecycle that
// more or less follows run loop queues.
//
// render
// afterRender
// destroy
//
export default Ember.Mixin.create({
  plugins: null,

  runLifeCycleEvent(lifecycle) {
    let hash = this.$().data('pluggable') || {};

    Object.keys(this.plugins || {}).forEach(key => {
      let plugin = this.plugins[key];

      if (plugin[lifecycle]) {
        let save = plugin[lifecycle].call(this, hash[key]);

        if (typeof save !== 'undefined') {
          hash[key] = save;
        }
      }
    });

    this.$().data('pluggable', hash);
  },

  didInsertElement() {
    this._super(...arguments);

    this.$().data('$E', this);

    this.runLifeCycleEvent('render');

    Ember.run.schedule('afterRender', () => {
      this.runLifeCycleEvent('afterRender');
    });
  },

  willDestroyElement() {
    this._super(...arguments);

    this.$().removeData('$E');

    this.runLifeCycleEvent('destroy');
  }
});
